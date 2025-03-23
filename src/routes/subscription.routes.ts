import { createSubscription, editSubscription, getAllSubscriptions, getSubscription, deleteSubscription, getUserSubscriptions, cancelSubscription } from "@/http/controllers/subscription.controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Request, Response, Router } from "express";


export const subscriptionRouter = Router()

subscriptionRouter.get('/', getAllSubscriptions)

subscriptionRouter.post('/', authMiddleware, createSubscription)

subscriptionRouter.get('/:id', getSubscription)

subscriptionRouter.put('/:id', authMiddleware, editSubscription)

subscriptionRouter.delete('/:id', deleteSubscription)

subscriptionRouter.get('/user/:id', getUserSubscriptions)

subscriptionRouter.patch('/:id/cancel', cancelSubscription)

subscriptionRouter.put('/upcoming-renewals', (req: Request, res: Response) => {
    res.send('Reactivate a specific subscription')    
})