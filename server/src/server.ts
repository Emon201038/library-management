/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import connectDb from "./app/config/db.config";
import { PORT } from "./secret";

let server: Server;

const startServer = async () => {
  try {
    await connectDb();

    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
})();

process.on("unhandledRejection", (error) => {
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  if (server) {
    server.close();
  }
});
