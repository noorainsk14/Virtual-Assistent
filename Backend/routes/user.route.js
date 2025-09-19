import express from "express";
import { getCurrentUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/current", getCurrentUser);

export default userRouter;
