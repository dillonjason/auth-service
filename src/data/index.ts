import mongoose from "mongoose";
import config from "config";
import { FastifyPluginCallback } from "fastify";
import { GroupModel } from "./schema/group";
import { UserModel } from "./schema/user";

const createRequiredData = async () => {
  const adminGroup = new GroupModel({
    name: "admin",
  });

  const adminUser = new UserModel({
    username: config.get("app.admin.user"),
    password: config.get("app.admin.password"),
    groups: [adminGroup],
  });

  await Promise.all([
    UserModel.findOneAndUpdate(
      { username: adminUser.username },
      adminUser.toJSON(),
      {
        upsert: true,
      }
    ),
    GroupModel.findOneAndUpdate(
      { name: adminGroup.name },
      adminGroup.toJSON(),
      {
        upsert: true,
      }
    ),
  ]);
};

export const connectDatabase: FastifyPluginCallback = async (
  app,
  options,
  next
) => {
  await mongoose.connect(
    config.get("database.url"),
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      auth: {
        user: config.get("database.user"),
        password: config.get("database.password"),
      },
      dbName: config.get("database.name"),
    },
    (error) => {
      if (error) {
        app.log.error(error);
        process.exit(1);
      }
    }
  );

  await createRequiredData();

  next();
};
