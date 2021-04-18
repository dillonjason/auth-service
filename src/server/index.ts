import fastify from "fastify";
import config from "config";
import { connectDatabase } from "../data";

import { user } from "./routes/user";
import { group } from "./routes/group";

const app = fastify({ logger: true });

// Connect to database
app.register(connectDatabase);

// Routes
app.register(user);
app.register(group);

app.listen(config.get("app.port"), "0.0.0.0", (error) => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }
});
