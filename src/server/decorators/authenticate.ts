import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { validateToken } from "../../utils/jwt";
import { Header } from "../header";
import { Status } from "../status";

export function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction
): void | undefined {
  const accessTokenHeader = request.headers[Header.Authorization];

  if (!accessTokenHeader) {
    reply.status(Status.Unauthorized);
    reply.send(new Error("Access denied, no token found."));
    return;
  }
  const [, accessToken] = accessTokenHeader.split(" ");
  const token = validateToken(accessToken);

  if (!token) {
    reply.status(Status.Unauthorized);
    reply.send(new Error("Access denied, invalid token."));
    return;
  }

  const userInGroup = token.groups.some((group) => group === "admin");

  if (!userInGroup) {
    reply.status(Status.Unauthorized);
    reply.send(new Error("Access denied, user not in group."));
    return;
  }

  next();
}
