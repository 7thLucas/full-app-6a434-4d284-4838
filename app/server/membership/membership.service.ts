import crypto from "node:crypto";
import { MembershipModel } from "./membership.model";
import { PointsEntryModel, PointsReason } from "./points-ledger.model";
import {
  PurchaseVerificationModel,
  PurchaseStatus,
} from "./purchase.model";
import { getServerConfig, num } from "./config.server";
import { defaultConfigurablesData, type TTier } from "~/modules/configurables/src/constants/configurables.default";

function makeError(message: string, statusCode: number): Error {
  return Object.assign(new Error(message), { statusCode });
}

function generateReferralCode(username: string): string {
  const base = (username || "navin")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6) || "NAVIN";
  const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${base}${suffix}`;
}

export interface MemberSummary {
  userId: string;
  username: string;
  email: string;
  referralCode: string;
  pointsBalance: number;
  lifetimePoints: number;
  referralCount: number;
  verifiedPurchaseCount: number;
  referredByCode: string | null;
  tier: { name: string; minPoints: number };
  nextTier: { name: string; minPoints: number; pointsAway: number } | null;
}

export interface PointsHistoryItem {
  amount: number;
  reason: string;
  description?: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  proofUrl: string;
  reference?: string;
  status: string;
  pointsAwarded: number;
  createdAt: string;
}

export class MembershipService {
  /** Resolve membership for a user, creating it on first access. */
  static async ensureMembership(user: {
    id: string;
    username: string;
    email: string;
  }) {
    let membership = await MembershipModel.findOne({ userId: user.id });
    if (membership) return membership;

    // Generate a unique referral code (retry on rare collisions).
    let referralCode = generateReferralCode(user.username);
    for (let i = 0; i < 5; i++) {
      const exists = await MembershipModel.findOne({ referralCode });
      if (!exists) break;
      referralCode = generateReferralCode(user.username);
    }

    membership = await MembershipModel.create({
      userId: user.id,
      username: user.username,
      email: user.email,
      referralCode,
      lifetimePoints: 0,
      pointsBalance: 0,
    });

    // Welcome points (configurable).
    const config = await getServerConfig();
    const joinPoints = num(config.pointsForJoining, 100);
    if (joinPoints > 0) {
      await this.awardPoints(
        user.id,
        joinPoints,
        PointsReason.Join,
        "Welcome to the community",
      );
    }

    return MembershipModel.findOne({ userId: user.id });
  }

  /** Append a ledger entry and update the member's balances atomically-ish. */
  static async awardPoints(
    userId: string,
    amount: number,
    reason: PointsReason,
    description?: string,
  ) {
    await PointsEntryModel.create({ userId, amount, reason, description });

    const inc: Record<string, number> = { pointsBalance: amount };
    // lifetimePoints only tracks earnings (positive movements).
    if (amount > 0) inc.lifetimePoints = amount;

    await MembershipModel.updateOne({ userId }, { $inc: inc });
  }

  static tierFor(lifetimePoints: number, tiers: TTier[]): {
    current: TTier;
    next: (TTier & { pointsAway: number }) | null;
  } {
    const sorted = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
    let current = sorted[0] ?? { name: "Member", minPoints: 0 };
    let next: (TTier & { pointsAway: number }) | null = null;

    for (let i = 0; i < sorted.length; i++) {
      if (lifetimePoints >= sorted[i].minPoints) {
        current = sorted[i];
        const n = sorted[i + 1];
        next = n ? { ...n, pointsAway: Math.max(0, n.minPoints - lifetimePoints) } : null;
      }
    }
    return { current, next };
  }

  static async getSummary(user: {
    id: string;
    username: string;
    email: string;
  }): Promise<MemberSummary> {
    const membership = await this.ensureMembership(user);
    if (!membership) throw makeError("Membership not found", 404);

    const config = await getServerConfig();
    const tiers = (config.tiers && config.tiers.length > 0
      ? config.tiers
      : defaultConfigurablesData.tiers) as TTier[];
    const { current, next } = this.tierFor(membership.lifetimePoints, tiers);

    return {
      userId: membership.userId,
      username: membership.username,
      email: membership.email,
      referralCode: membership.referralCode,
      pointsBalance: membership.pointsBalance,
      lifetimePoints: membership.lifetimePoints,
      referralCount: membership.referralCount,
      verifiedPurchaseCount: membership.verifiedPurchaseCount,
      referredByCode: membership.referredByCode ?? null,
      tier: { name: current.name, minPoints: current.minPoints },
      nextTier: next
        ? { name: next.name, minPoints: next.minPoints, pointsAway: next.pointsAway }
        : null,
    };
  }

  static async getPointsHistory(userId: string, limit = 25): Promise<PointsHistoryItem[]> {
    const entries = await PointsEntryModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return entries.map((e) => ({
      amount: e.amount,
      reason: e.reason,
      description: e.description,
      createdAt: (e.createdAt as Date).toISOString(),
    }));
  }

  // ── Referrals ─────────────────────────────────────────────────────────────

  /**
   * Attribute a referral once, when a new member applies an inviter's code.
   * Awards both sides their configured points. Idempotent: a member can only
   * ever be referred by one inviter, and only once.
   */
  static async applyReferral(
    newMember: { id: string; username: string; email: string },
    referralCode: string,
  ): Promise<{ inviter: string }> {
    const code = referralCode.trim().toUpperCase();
    if (!code) throw makeError("Referral code is required", 400);

    const membership = await this.ensureMembership(newMember);
    if (!membership) throw makeError("Membership not found", 404);

    if (membership.referredByCode) {
      throw makeError("You have already used a referral code", 409);
    }

    const inviter = await MembershipModel.findOne({ referralCode: code });
    if (!inviter) throw makeError("Invalid referral code", 404);
    if (inviter.userId === newMember.id) {
      throw makeError("You cannot refer yourself", 400);
    }

    const config = await getServerConfig();
    const inviterPoints = num(config.pointsPerReferralInviter, 150);
    const inviteePoints = num(config.pointsPerReferralInvitee, 75);

    // Link the referral on the new member.
    await MembershipModel.updateOne(
      { userId: newMember.id },
      { $set: { referredByCode: code, referredByUserId: inviter.userId } },
    );

    // Award invitee.
    if (inviteePoints > 0) {
      await this.awardPoints(
        newMember.id,
        inviteePoints,
        PointsReason.ReferralInvitee,
        `Joined with referral code ${code}`,
      );
    }

    // Award inviter + bump their referral count.
    if (inviterPoints > 0) {
      await this.awardPoints(
        inviter.userId,
        inviterPoints,
        PointsReason.ReferralInviter,
        `Referred ${newMember.username}`,
      );
    }
    await MembershipModel.updateOne(
      { userId: inviter.userId },
      { $inc: { referralCount: 1 } },
    );

    return { inviter: inviter.username };
  }

  static async getReferredMembers(userId: string) {
    const members = await MembershipModel.find({ referredByUserId: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
    return members.map((m) => ({
      username: m.username,
      joinedAt: (m.createdAt as Date).toISOString(),
    }));
  }

  // ── Purchase verification ──────────────────────────────────────────────────

  static async submitPurchase(
    user: { id: string; username: string; email: string },
    input: { proofUrl: string; proofPath?: string; reference?: string },
  ): Promise<PurchaseItem> {
    if (!input.proofUrl) throw makeError("Proof of purchase is required", 400);

    await this.ensureMembership(user);
    const config = await getServerConfig();
    const points = num(config.pointsPerVerifiedPurchase, 50);

    const record = await PurchaseVerificationModel.create({
      userId: user.id,
      proofUrl: input.proofUrl,
      proofPath: input.proofPath,
      reference: input.reference,
      status: PurchaseStatus.Verified,
      pointsAwarded: points,
    });

    if (points > 0) {
      await this.awardPoints(
        user.id,
        points,
        PointsReason.Purchase,
        input.reference ? `Verified purchase (${input.reference})` : "Verified purchase",
      );
    }
    await MembershipModel.updateOne(
      { userId: user.id },
      { $inc: { verifiedPurchaseCount: 1 } },
    );

    return {
      id: record._id.toString(),
      proofUrl: record.proofUrl,
      reference: record.reference,
      status: record.status,
      pointsAwarded: record.pointsAwarded,
      createdAt: (record.createdAt as Date).toISOString(),
    };
  }

  static async getPurchases(userId: string, limit = 25): Promise<PurchaseItem[]> {
    const records = await PurchaseVerificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return records.map((r) => ({
      id: r._id.toString(),
      proofUrl: r.proofUrl,
      reference: r.reference,
      status: r.status,
      pointsAwarded: r.pointsAwarded,
      createdAt: (r.createdAt as Date).toISOString(),
    }));
  }

  // ── Rewards redemption ──────────────────────────────────────────────────────

  static async redeemReward(
    user: { id: string; username: string; email: string },
    rewardTitle: string,
  ): Promise<{ pointsBalance: number; reward: string }> {
    const membership = await this.ensureMembership(user);
    if (!membership) throw makeError("Membership not found", 404);

    const config = await getServerConfig();
    const catalog = config.rewardsCatalog ?? [];
    const reward = catalog.find((r) => r.title === rewardTitle);
    if (!reward) throw makeError("Reward not found", 404);

    if (membership.pointsBalance < reward.cost) {
      throw makeError("Not enough points to redeem this reward", 400);
    }

    await this.awardPoints(
      user.id,
      -reward.cost,
      PointsReason.Redemption,
      `Redeemed: ${reward.title}`,
    );

    const updated = await MembershipModel.findOne({ userId: user.id });
    return {
      pointsBalance: updated?.pointsBalance ?? 0,
      reward: reward.title,
    };
  }
}
