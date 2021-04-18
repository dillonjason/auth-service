import config from "config";
import jwt from "jsonwebtoken";
import { Payload, Tokens } from "./types";

export function createTokens(payload: Payload): Tokens {
  const secret = config.get("app.auth.secret") as string;
  const accessExpires = config.get("app.auth.accessExpires") as number;
  const refreshExpires = config.get("app.auth.refreshExpires") as number;

  const refreshExpireDate = new Date();
  refreshExpireDate.setSeconds(refreshExpireDate.getSeconds() + refreshExpires);

  const accessToken = jwt.sign(payload, secret, {
    expiresIn: accessExpires,
  });

  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: refreshExpires,
  });

  return {
    accessToken,
    refreshToken,
    refreshExpireDate,
  };
}
