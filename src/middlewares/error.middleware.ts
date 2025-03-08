import { Request, Response, NextFunction } from "express"

interface HttpError extends Error {
    status?: number;
    code?: number;
    path?: string;
    keyValue?: any;
    errors?: Record<string, { message: string }>
}

export const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    try {
        let error = { ...err }

        console.error(error)

        //Mongoose bad ObjectId
        if (error.name === 'CastError') {
            const message = `Resource not found. Invalid: ${error.path}`
            error = new Error(message)
            error.status = 404
        }

        // Mongoose duplicate key
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} entered`
            error = new Error(message)
            error.status = 400
        }

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            const message = error.errors ? Object.values(error.errors).map((val: { message: string }) => val.message) : []
            error = new Error(message.join(', '))
            error.status = 400
        }

        res.status(error.status || 500).json({
            success: false,
            error: error.message || 'Server Error'
        })

    } catch (error) {
        next(error)
    }
}
