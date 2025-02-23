import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/userController.js";

const userRouter = Router();

// Authentication Routes
userRouter.post("/register", register);
userRouter.post("/login", login);

// Password Reset Routes
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
