import { FastifyPluginCallback } from "fastify";
import { login } from "../../utils/auth";
import { refreshAccessToken, validateToken } from "../../utils/jwt";
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
        reply.header(Header.Authorization, `Bearer ${accessToken}`);
        reply.send(accessToken);
      } catch (error) {
        app.log.error({ ...error, username });
        reply.clearCookie(Cookie.RefreshToken);
        reply.removeHeader(Header.Authorization);
        reply.status(401);
        reply.send(error);
      }
    }
  );

  app.get<{ Headers: { [Header.Authorization]: string } }>(
    `${path}/validate`,
    async (request, reply) => {
      const accessTokenHeader = request.headers[Header.Authorization];
      if (!accessTokenHeader) {
        reply.status(401);
        reply.send(
          new Error(
            `No access token found, set the header ${Header.Authorization}`
          )
        );
        return;
      }

      const [, accessToken] = accessTokenHeader.split(" ");
      const validated = validateToken(accessToken);

      if (validated) {
        reply.send("OK");
      } else {
        reply.status(401);
        reply.send(new Error(`Access token expired`));
      }
    }
  );

  app.post(`${path}/refresh`, async (request, reply) => {
    const { value: refreshToken } = request.unsignCookie(
      request.cookies[Cookie.RefreshToken]
    );

    if (!refreshToken) {
      reply.status(401);
      reply.send(new Error(`No refresh token found`));
      return;
    }

    const newAccessToken = refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      reply.status(401);
      reply.send(new Error(`Invalid refresh token`));
      return;
    }

    reply.header(Header.Authorization, `Bearer ${newAccessToken}`);
    reply.send(newAccessToken);
  });

  next();
};
