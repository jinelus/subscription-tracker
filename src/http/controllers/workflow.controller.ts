import { Subscription } from '@/db/models/subscription.model';
import { sendReminderEmail } from '@/utils/send-email';
import { serve, type WorkflowContext } from '@upstash/workflow'
import dayjs from 'dayjs'

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve<{ subscriptionId: string }>(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fecthSubscription(context, subscriptionId)

    if(!subscription || subscription.status !== 'active') return

    const renewalDate = dayjs(subscription.renewalDate)

    if(renewalDate.isBefore(dayjs())) {
        console.log('Renewal date has passed for subscription ', subscriptionId)
        return
    }

    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day')

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `${daysBefore} days before reminder`, reminderDate.toDate())
        }

        await triggerReminder(context, `reminder ${daysBefore} days before`, subscription)
    }

})

const fecthSubscription = async (context: WorkflowContext<{
    subscriptionId: string;
}>, subscriptionId: string) => {

    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
}

const sleepUntilReminder = async (context: WorkflowContext, label: string, date: Date) => {
    console.log('Sleeping until', label, ' reminder at', date)
    await context.sleepUntil(label, date)
}

const triggerReminder = async (context: WorkflowContext, label: string, subscription: any) => {
    return await context.run(label, async () => {
        //Send email, sms, notifications
        console.log('triggering', label, 'reminder')

        await sendReminderEmail({ subscription, to: subscription.user.email, type: label })
    })
}