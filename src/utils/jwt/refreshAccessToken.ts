import config from "config";
import jwt from "jsonwebtoken";
import { validateToken } from "./validateToken";

export function refreshAccessToken(refreshToken: string): string | undefined {
  const validatedRefresh = validateToken(refreshToken);
  if (!validatedRefresh) return;

  return jwt.sign(
    {
      id: validatedRefresh.id,
      username: validatedRefresh.username,
      groups: validatedRefresh.groups,
    },
    config.get("app.auth.secret"),
    {
      expiresIn: config.get("app.auth.accessExpires"),
    }
  );
}
