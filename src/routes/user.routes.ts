import { editUser, getAllUsers, getUser, getUserById, getUsersByName } from "@/http/controllers/users.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";


export const userRouter = Router()

userRouter.get('/me', authMiddleware, getUser)
userRouter.get('/', authMiddleware, getAllUsers)
userRouter.get('/:id', authMiddleware, getUserById)
userRouter.put('/:id', authMiddleware, editUser)
userRouter.put('/?query', authMiddleware, getUsersByName)