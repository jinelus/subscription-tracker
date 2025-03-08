import { Subscription } from "@/db/models/subscription.model";
import { User } from "@/db/models/user.model";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const subscriptionSchema = z.object({
    name: z.string(),
    price: z.number(),
    currency: z.enum(['USD', 'EUR', 'BRL']).default('BRL'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    category: z.enum(['sports', 'entertainment', 'health', 'education', 'other']).optional(),
    paymentMethod: z.enum(['card', 'bank', 'paypal', 'boleto']).optional(),
    userId: z.string(),
})

const subscriptionParamsSchema = z.object({
    id: z.string()
})

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { currency, name, price, userId, category, frequency, paymentMethod } = subscriptionSchema.parse(req.body)

    const subscription = await Subscription.create({
        name,
        category,
        frequency,
        paymentMethod,
        price,
        currency,
        user: {
            id: userId
        }
    })

    if(!subscription) {
        res.status(400).json({ success: false, error: 'Subscription not created' })
        return
    }

    res.status(201).json({ success: true, data: subscription })
}

export const getAllSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    const subscriptions = await Subscription.find()

    res.status(200).json({ success: true, data: subscriptions })
}

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = subscriptionParamsSchema.parse(req.params)

    const subscription = await Subscription.findById(id)

    if(!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found' })
        return
    }


    res.status(200).json({ success: true, data: subscription })

}

export const editSubscription = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = subscriptionParamsSchema.parse(req.params)

    const { currency, name, price, userId, category, frequency, paymentMethod } = subscriptionSchema.parse(req.body)

    const newSubscription = await Subscription.findByIdAndUpdate(id, {
        name,
        category,
        frequency,
        paymentMethod,
        price,
        currency,
        user: {
            id: userId
        }
    }, { new: true })

    if(!newSubscription) {
        res.status(404).json({ success: false, error: 'Subscription not found' })
        return
    }

    res.status(204).json({ success: true, data: newSubscription })
}

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = subscriptionParamsSchema.parse(req.params)

    const subscription = await Subscription.findByIdAndDelete(id)

    if(!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found' })
        return
    }

    res.status(204).json({ success: true })
}

export const getUserSubscriptions = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = subscriptionParamsSchema.parse(req.params)

    const user = await User.findById(id)

    if(!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
    }

    const subscriptions = await Subscription.find({ user: { id: user.id } })

    res.status(200).json({ success: true, data: subscriptions })
}

export const cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = subscriptionParamsSchema.parse(req.params)

    const user = await User.findById(id)

    if(!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
    }

    await Subscription.findByIdAndUpdate(user.id, { status: 'cancelled'})

    res.status(204).json({ success: true })
}