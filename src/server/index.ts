import fastify from "fastify";
import config from "config";
import fastifyCookie from "fastify-cookie";
import { connectDatabase } from "../data";

import { user } from "./routes/user";
import { group } from "./routes/group";
import { auth } from "./routes/auth";

const app = fastify({ logger: true });

// App configuration
app.register(fastifyCookie, {
  secret: config.get("app.cookie.secret"),
});

// Connect to database
app.register(connectDatabase);

// Routes
app.register(user);
app.register(group);
app.register(auth);

app.listen(config.get("app.port"), "0.0.0.0", (error) => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }
});
