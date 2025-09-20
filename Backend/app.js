import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//imports routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import { updateAssistant } from "./controllers/user.controller.js";

//route declaration
app.use("/api/v1/users/auth", authRouter);
app.use("/api/v1/users/", userRouter);

export { app };
