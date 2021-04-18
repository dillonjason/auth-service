import { Schema, Document, Model, model } from "mongoose";

export interface Group {
  /** Name of the group */
  name: string;
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
});

export const GroupModel = model<GroupDocument, GroupModel>(
  "Group",
  groupSchema
);
