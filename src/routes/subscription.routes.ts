import { createSubscription, editSubscription, getAllSubscriptions, getSubscription, deleteSubscription, getUserSubscriptions, cancelSubscription } from "@/http/controllers/subscription.controllers";
import { Request, Response, Router } from "express";


export const subscriptionRouter = Router()

subscriptionRouter.get('/', getAllSubscriptions)

subscriptionRouter.post('/', createSubscription)

subscriptionRouter.get('/:id', getSubscription)

subscriptionRouter.put('/:id', editSubscription)

subscriptionRouter.delete('/:id', deleteSubscription)

subscriptionRouter.get('/user/:id', getUserSubscriptions)

subscriptionRouter.patch('/:id/cancel', cancelSubscription)

subscriptionRouter.put('/upcoming-renewals', (req: Request, res: Response) => {
    res.send('Reactivate a specific subscription')    
})