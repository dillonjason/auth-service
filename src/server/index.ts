import fastify from "fastify";
import config from "config";
import { connectDatabase } from "../data";

const app = fastify({ logger: true });

// Connect to database
app.register(connectDatabase);

// Routes

app.listen(config.get("app.port"), "0.0.0.0", (error) => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }
});
