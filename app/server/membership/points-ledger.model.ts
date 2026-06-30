import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  index,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export enum PointsReason {
  Join = "join",
  Purchase = "purchase",
  ReferralInviter = "referral_inviter",
  ReferralInvitee = "referral_invitee",
  Redemption = "redemption",
}

/**
 * Immutable append-only ledger of every points movement for a member.
 * `amount` is positive for earnings, negative for redemptions.
 */
@index({ userId: 1, createdAt: -1 })
@modelOptions({
  schemaOptions: {
    collection: "tbl_points_ledger",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class PointsEntry extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: Number, required: true })
  amount!: number;

  @prop({ type: String, enum: PointsReason, required: true })
  reason!: PointsReason;

  @prop({ type: String, required: false })
  description?: string;
}

export const PointsEntryModel = getModelForClass(PointsEntry);
