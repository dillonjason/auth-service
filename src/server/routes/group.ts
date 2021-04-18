import { FastifyPluginCallback } from "fastify";
import { GroupModel, Group } from "../../data/schema/group";

const path = "/group";

export const group: FastifyPluginCallback = (app, options, next) => {
  app.addHook("onRequest", app.authenticate);

  app.post<{ Body: Group }>(path, async (request, reply) => {
    const newGroup = await GroupModel.create(request.body);
    reply.send(newGroup);
  });

  app.get(path, async (request, response) => {
    const groups = await GroupModel.find().exec();
    response.send(groups);
  });

  app.get<{ Params: { id: string } }>(
    `${path}/:id`,
    async (request, response) => {
      const group = await GroupModel.findById(request.params.id).exec();
      response.send(group);
    }
  );

  app.put<{ Params: { id: string }; Body: Partial<Group> }>(
    `${path}/:id`,
    async (request, reply) => {
      const newGroupData = request.body;
      const updatedGroup = await GroupModel.findByIdAndUpdate(
        request.params.id,
        newGroupData,
        { new: true }
      );
      reply.send(updatedGroup);
    }
  );

  app.delete<{ Params: { id: string } }>(
    `${path}/:id`,
    async (request, reply) => {
      await GroupModel.findByIdAndDelete(request.params.id);
      reply.code(200).send();
    }
  );

  next();
};
