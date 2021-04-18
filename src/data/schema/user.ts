import { Schema, Document, Model, model } from "mongoose";
import { encrypt } from "../../utils/password";
import { GroupModel } from "./group";

export interface User {
  /** User name for login */
  username: string;
  /** User password for login */
  password?: string;
  /** User token for login */
  token?: string;
  /** Groups the user belongs to */
  groups: string[];
}

export interface UserDocument extends User, Document {}
export type UserModel = Model<UserDocument>;

export const userSchema = new Schema<UserDocument, UserModel>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    set: encrypt,
  },
  token: { type: String, set: encrypt },
  groups: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: GroupModel.name,
  },
});

export const UserModel = model<UserDocument, UserModel>("User", userSchema);
