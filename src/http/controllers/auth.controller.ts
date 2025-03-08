import { User } from "@/db/models/user.model";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { Hash } from "../cryptographie/hash";
import jwt from 'jsonwebtoken'
import { env } from "@/config/env";

const bodySignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

const bodySignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { name, email, password } = bodySignUpSchema.parse(req.body)

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error = new Error('User already exists')

            res.status(400).json({
                success: false,
                error: error.message
            })
        }
 
        const hashedPassword = await Hash.hashPassword(password)

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session })

        const token = jwt.sign({
            id: newUsers[0]._id,
        }, env.JWT_SECRET, {
            expiresIn: '1d'
        })

        await session.commitTransaction()
        session.endSession()

        res.status(201).send({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

export const signIn = async (req: Request, res: Response) => {

    const { email, password } = bodySignInSchema.parse(req.body)

    const user = await User.findOne({ email })

    if(!user) {
        const newError = new Error('User not found')

        res.status(404).send({
            success: false,
            error: newError.message
        })

        return
    }

    const isPasswordValid = await Hash.comparePassword(password, user.password)

    if(!isPasswordValid) {
        const newError = new Error('Invalid password')

        res.status(401).send({
            success: false,
            error: newError.message
        })

        return
    }

    const token = jwt.sign({
        id: user._id,
    }, env.JWT_SECRET, {
        expiresIn: '1d'
    })

    res.status(200).send({
        success: true,
        message: 'User signed in successfully',
        data: {
            token,
        }
    })
}

export const signOut = async (req: Request, res: Response) => {
    
}