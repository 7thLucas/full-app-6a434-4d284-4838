import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  index,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export enum PurchaseStatus {
  /** Auto-approved on submit (MVP: proof-of-purchase upload is trusted). */
  Verified = "verified",
  Pending = "pending",
  Rejected = "rejected",
}

/**
 * A proof-of-purchase verification submitted by a member. Each verified
 * purchase is a real, validated action — the operation that matters.
 */
@index({ userId: 1, createdAt: -1 })
@modelOptions({
  schemaOptions: {
    collection: "tbl_purchase_verifications",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class PurchaseVerification extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  /** Uploaded proof image URL (served via the uploader proxy). */
  @prop({ type: String, required: true })
  proofUrl!: string;

  /** Original filename / storage id for reference. */
  @prop({ type: String, required: false })
  proofPath?: string;

  /** Optional member-entered reference (receipt no, bottle code, store). */
  @prop({ type: String, required: false })
  reference?: string;

  @prop({ type: String, enum: PurchaseStatus, default: PurchaseStatus.Verified })
  status!: PurchaseStatus;

  /** Points awarded for this verification at the time of submission. */
  @prop({ type: Number, default: 0 })
  pointsAwarded!: number;
}

export const PurchaseVerificationModel = getModelForClass(PurchaseVerification);
