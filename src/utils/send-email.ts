import type { z } from "zod"
import { emailTemplates, type EmailProps } from "./email-template"
import type { subscriptionSchema } from "@/http/controllers/subscription.controllers"
import dayjs from "dayjs"
import { env } from "@/config/env"
import { transporter } from "@/config/nodemailer"

interface SendEmailProps {
    to: string
    type: string
    subscription: any
}

export const sendReminderEmail = async ({
    subscription,
    to,
    type
}: SendEmailProps) => {
    if(!to || !type) throw new Error('Missing required fields')

    const template = emailTemplates.find((template) => template.label === type)

    if(!template) throw new Error('Invalid email type')

    const mailInfo: EmailProps = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('YYYY-MM-DD'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price.toFixed(2)} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
        daysLeft: 1
    }

    const message = template.generateBody(mailInfo)

    const subject = template.generateSubject(mailInfo)

    const mailOptions = {
        from: env.EMAIL_ACCOUNT,
        to,
        subject,
        html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })

}