import { signIn, signOut, signUp } from "@/http/controllers/auth.controller";
import { Router } from "express";

export const authRouter = Router()


authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/sign-out', signOut);