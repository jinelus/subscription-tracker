import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from '../config/env'
import { User } from "@/db/models/user.model"
import { z } from "zod"

const jwtPayloadSchema = z.object({ id: z.string() })

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) {
        res.status(401).json({ success: false, error: 'Unauthorized' })
        return
    }

    const decodedToken = jwt.verify(token, env.JWT_SECRET)

    const { id } = jwtPayloadSchema.parse(decodedToken)

    req.userId = id

    next()
    } catch (error) {
        res.status(401).json({ success: false, error: 'Unauthorized' })
    }
}