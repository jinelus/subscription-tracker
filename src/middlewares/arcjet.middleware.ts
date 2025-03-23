import { aj } from "@/config/arcjet";
import type { NextFunction, Request, Response } from "express";


export const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const decision = await aj.protect(req, {
            requested: 1,
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                res.status(429).json({ success: false, error: "Rate limit exceeded" })
                return
            }
            if(decision.reason.isBot()) {
                res.status(403).json({ success: false, error: "Bot detected" })
                return
            }

            
            res.status(403).json({ success: false, error: "Access denied" })

            return 
        }

        next()

    }catch (error) {
        console.log("Arcjet middleware error: ", error)
        next(error)
    }
}