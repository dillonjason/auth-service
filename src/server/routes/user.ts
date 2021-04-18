import { FastifyPluginCallback } from "fastify";
import { UserModel, User } from "../../data/schema/user";

const path = "/user";

export const user: FastifyPluginCallback = (app, options, next) => {
  app.addHook("onRequest", app.authenticate);

  app.post<{ Body: User }>(path, async (request, reply) => {
    const newUser = await UserModel.create(request.body);
    reply.send(newUser);
  });

  app.get(path, async (request, response) => {
    const users = await UserModel.find().select("-password").exec();
    response.send(users);
  });

  app.get<{ Params: { id: string } }>(
    `${path}/:id`,
    async (request, response) => {
      const user = await UserModel.findById(request.params.id)
        .select("-password")
        .exec();
      response.send(user);
    }
  );

  app.put<{ Params: { id: string }; Body: Partial<User> }>(
    `${path}/:id`,
    async (request, reply) => {
      const newUserData = request.body;
      const updatedUser = await UserModel.findByIdAndUpdate(
        request.params.id,
        newUserData,
        { new: true }
      );
      reply.send(updatedUser);
    }
  );

  app.delete<{ Params: { id: string } }>(
    `${path}/:id`,
    async (request, reply) => {
      await UserModel.findByIdAndDelete(request.params.id);
      reply.code(200).send();
    }
  );

  next();
};
