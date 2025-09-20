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
import geminiResponse from "./gemini.js";

//route declaration
app.use("/api/v1/users/auth", authRouter);
app.use("/api/v1/users/", userRouter);

app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data.candidates[0].content.parts[0].text);
});

export { app };
