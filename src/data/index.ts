import mongoose from "mongoose";
import config from "config";
import { FastifyPluginCallback } from "fastify";
import { GroupModel } from "./schema/group";
import { UserModel } from "./schema/user";

async function createAdminGroup() {
  const adminGroup = {
    name: "admin",
  };

  const exists = await GroupModel.exists({ name: adminGroup.name });

  if (!exists) {
    GroupModel.create(adminGroup);
  }
}

async function createAdminUser() {
  const adminGroup = await GroupModel.findOne({ name: "admin" });

  const adminUser = {
    username: config.get("app.admin.user") as string,
    password: config.get("app.admin.password"),
    groups: [adminGroup],
  };

  const exists = await UserModel.exists({ username: adminUser.username });

  if (!exists) {
    UserModel.create(adminUser);
  }
}

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

  await createAdminGroup();
  await createAdminUser();

  next();
};
