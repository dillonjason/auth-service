import { onRequestHookHandler } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: onRequestHookHandler;
  }
}
