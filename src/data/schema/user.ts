import { Schema, Document, Model, model } from "mongoose";
import { GroupDocument, GroupModel } from "./group";

interface User {
  /** User name for login */
  username: string;
  /** User password for login */
  password?: string;
  /** User token for login */
  token?: string;
  /** Groups the user belongs to */
  groups: GroupDocument[];
}

export interface UserDocument extends User, Document {}
export type UserModel = Model<UserDocument>;

const UserSchema = new Schema<UserDocument, UserModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },
  token: { type: String },
  groups: { type: [GroupModel], required: true },
});

export const UserModel = model<UserDocument, UserModel>("User", UserSchema);
