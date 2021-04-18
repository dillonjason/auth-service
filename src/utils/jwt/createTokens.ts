import config from "config";
import jwt from "jsonwebtoken";
import { Payload } from "./types";

interface Options {
  /** Did the user login with a token */
  tokenLogin?: boolean;
}

interface Tokens {
  /** Token provided to the client to enable access */
  accessToken: string;
  /** Token sent to client in httpOnly to refresh access */
  refreshToken: string;
}

export function createTokens(payload: Payload, options: Options = {}): Tokens {
  const secret = config.get("app.auth.secret") as string;
  const { tokenLogin } = options;

  const accessToken = jwt.sign(payload, secret, {
    expiresIn: config.get("app.auth.accessExpires"),
  });

  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: tokenLogin
      ? config.get("app.auth.tokenRefreshExpire")
      : config.get("app.auth.refreshExpire"),
  });

  return {
    accessToken,
    refreshToken,
  };
}
