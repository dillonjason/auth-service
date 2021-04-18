import { UserModel } from "../../data/schema/user";
import { createTokens } from "../jwt";
import { Tokens } from "../jwt/types";
import { compare } from "../password";

export async function login(
  username: string,
  password: string
): Promise<Tokens> {
  const user = await UserModel.findOne({ username }).exec();
  if (!user) {
    throw new Error("Unable to find user");
  }

  if (!user.password) {
    throw new Error(
      "Unable to login a user without a password, did you mean to use a token?"
    );
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  return createTokens({
    id: user.id,
    username,
    groups: user.groups,
  });
}
