import config from "config";
import jwt from "jsonwebtoken";
import { Payload } from "./types";

export function validateToken(token: string): Payload | undefined {
  let decoded;
  const secret = config.get("app.auth.secret") as string;

  try {
    decoded = jwt.verify(token, secret) as Payload;
  } catch (e) {
    // Invalid token
  }

  return decoded;
}
