import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  index,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

/**
 * Membership — one record per registered member, keyed by the auth user id.
 *
 * The authentication module owns identity (tbl_users). This collection owns
 * the community/loyalty domain: points balance, referral code, and referral
 * attribution. Kept separate so the auth module stays generic.
 */
@index({ userId: 1 }, { unique: true })
@index({ referralCode: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    collection: "tbl_memberships",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Membership extends CommonTypegooseEntity {
  @prop({ type: String, required: true, unique: true })
  userId!: string;

  @prop({ type: String, required: true })
  username!: string;

  @prop({ type: String, required: true })
  email!: string;

  /** Unique, shareable referral code for this member. */
  @prop({ type: String, required: true, unique: true })
  referralCode!: string;

  /** Lifetime points earned (never decreases). Used for tier calculation. */
  @prop({ type: Number, default: 0 })
  lifetimePoints!: number;

  /** Spendable points balance (lifetime minus redeemed). */
  @prop({ type: Number, default: 0 })
  pointsBalance!: number;

  /** Number of successful (verified) referrals this member has made. */
  @prop({ type: Number, default: 0 })
  referralCount!: number;

  /** Number of verified purchases this member has logged. */
  @prop({ type: Number, default: 0 })
  verifiedPurchaseCount!: number;

  /** referralCode of the member who invited this member, if any. */
  @prop({ type: String, required: false, default: null })
  referredByCode?: string | null;

  /** userId of the inviter, set once the referral is attributed. */
  @prop({ type: String, required: false, default: null })
  referredByUserId?: string | null;
}

export const MembershipModel = getModelForClass(Membership);
