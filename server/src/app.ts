import express from "express";
import cors from "cors";
import morgan from "morgan";
import bookRouter from "./app/routes/book.routes";
import borrowRouter from "./app/routes/borrow.routes";
import { errorHandler } from "./app/middlewares/errorHandler";
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://libraryfrontend-flame.vercel.app",
      "https://library-management-two-livid.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

//routes
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "App is running!", success: true });
});

//not found handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", success: false });
});

//error handler
app.use(errorHandler);

export default app;
