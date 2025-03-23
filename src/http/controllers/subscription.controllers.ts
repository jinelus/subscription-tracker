import { env } from "@/config/env";
import { workflowClient } from "@/config/upstash";
import { Subscription } from "@/db/models/subscription.model";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const subscriptionSchema = z.object({
    name: z.string(),
    price: z.number(),
    currency: z.enum(['USD', 'EUR', 'BRL']).optional().default('BRL'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().default('monthly'),
    category: z.enum(['sports', 'entertainment', 'health', 'education', 'other']).optional().default('other'),
    paymentMethod: z.enum(['card', 'bank', 'paypal', 'boleto']).optional().default('card'),
})

const subscriptionParamsSchema = z.object({
    id: z.string()
})

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { currency, name, price, category, frequency, paymentMethod } = subscriptionSchema.parse(req.body)

    const userId = req.userId

    const subscription = await Subscription.create({
        name,
        category,
        frequency,
        paymentMethod,
        price,
        currency,
        user: userId,
        startDate: new Date(),
    })

    if(!subscription) {
        res.status(400).json({ success: false, error: 'Subscription not created' })
        return
    }

    const { workflowRunId } = await workflowClient.trigger({
        url: `${env.SERVER_URL}/api/v1/workflow/subscription/reminder`,
        body: {
            subscriptionId: subscription.id
        },
        headers: {
            'Content-Type': 'application/json'
        },
        retries: 0
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } })
}

export const getAllSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId

    const subscriptions = await Subscription.find({ user: userId })

    res.status(200).json({ success: true, data: subscriptions })
}

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = subscriptionParamsSchema.parse(req.params)

    const userId = req.userId

    const subscription = await Subscription.findOne({ id, user: userId })

    if(!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found' })
        return
    }


    res.status(200).json({ success: true, data: subscription })

}

export const editSubscription = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = subscriptionParamsSchema.parse(req.params)

    const { currency, name, price, category, frequency, paymentMethod } = subscriptionSchema.parse(req.body)
    const userId = req.userId

    const newSubscription = await Subscription.findByIdAndUpdate(id, {
        name,
        category,
        frequency,
        paymentMethod,
        price,
        currency,
        user: userId,
    }, { new: true })

    if(!newSubscription) {
        res.status(404).json({ success: false, error: 'Subscription not found' })
        return
    }

    res.status(204).json({ success: true, data: newSubscription })
}

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = subscriptionParamsSchema.parse(req.params)

    const userId = req.userId

    const subscription = await Subscription.findOneAndDelete({ id, user: userId })

    if(!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found' })
        return
    }

    res.status(204).json({ success: true })
}

export const getUserSubscriptions = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = subscriptionParamsSchema.parse(req.params)

    const userId = req.userId

    if(id !== userId) {
        res.status(404).json({ success: false, error: 'You are not the owner of this subscription' })
        return
    }

    const subscriptions = await Subscription.find({ user: userId })

    res.status(200).json({ success: true, data: subscriptions })
}

export const cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = subscriptionParamsSchema.parse(req.params)

    const userId = req.userId

    await Subscription.findByIdAndUpdate({id, user: userId}, { status: 'cancelled'})

    res.status(204).json({ success: true })
}