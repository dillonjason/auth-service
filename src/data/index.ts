import mongoose from "mongoose";
import config from "config";
import { FastifyPluginCallback } from "fastify";
import * as admin from "../utils/admin";

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

  await admin.createGroup();
  await admin.createUser();

  next();
};
