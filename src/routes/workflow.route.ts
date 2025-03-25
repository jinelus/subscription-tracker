import { sendReminders } from "@/http/controllers/workflow.controller";
import { Router } from "express";


export const workflowRouter = Router()


workflowRouter.post('/subscription/reminder', async (req, res, next) => {
	sendReminders.handler(req as any)
		.then(response => res.json(response))
		.catch(next);
})