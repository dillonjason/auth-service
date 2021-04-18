import { Schema, Document, Model, model } from "mongoose";

export interface Group {
  /** Name of the group */
  name: string;
  /** Enable token login support */
  enableToken: string;
}

export interface GroupDocument extends Group, Document {}
export type GroupModel = Model<GroupDocument>;

export const groupSchema = new Schema<GroupDocument, GroupModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  enableToken: { type: Boolean, default: false },
});

export const GroupModel = model<GroupDocument, GroupModel>(
  "Group",
  groupSchema
);
