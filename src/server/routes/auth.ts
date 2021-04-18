import { FastifyPluginCallback } from "fastify";
import { login } from "../../utils/auth";
import { Cookie } from "../cookie";
import { Header } from "../header";

const path = "/auth";

export const auth: FastifyPluginCallback = (app, options, next) => {
  app.post<{ Body: { username: string; password: string } }>(
    `${path}/login`,
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      try {
        const { accessToken, refreshToken, refreshExpireDate } = await login(
          username,
          password
        );

        reply.setCookie(Cookie.RefreshToken, refreshToken, {
          httpOnly: true,
          signed: true,
          expires: refreshExpireDate,
        });
        reply.header(Header.AccessToken, `Bearer ${accessToken}`);
        reply.send(accessToken);
      } catch (error) {
        app.log.error({ ...error, username });
      }
    }
  );

  next();
};
