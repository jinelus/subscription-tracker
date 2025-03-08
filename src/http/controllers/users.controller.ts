import { User } from "@/db/models/user.model";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const getUserByIdSchema = z.object({
    id: z.string()
})

const editUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email()
})

const getUsersByNameSchema = z.object({
    query: z.string()
})

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {

    const users = await User.find()

    if(!users) return next(new Error('No users found'))

    res.status(200).json({ success: true, data: users})
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = getUserByIdSchema.parse(req.params)

    const user = await User.findById(id).select('-password')

    if(!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
    }

    res.status(200).json({ success: true, data: user})
}

export const getUsersByName = async (req: Request, res: Response, next: NextFunction) => {

    const { query } = getUsersByNameSchema.parse(req.query)

    const users = await User.find({ name: { $regex: query, $options: 'i' }}, {} , { limit: 10 })

    res.status(200).json({ success: true, data: users})
}

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, email } = editUserSchema.parse(req.body)

    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true })

    if(!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
    }

    res.status(204).json({ success: true, data: user})
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.userId

    const user = await User.findById(id).select('-password')

    if(!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
    }

    res.status(200).json({ success: true, data: user})
}