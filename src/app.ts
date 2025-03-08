import express from 'express';
import cookieParser from 'cookie-parser'
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { userRouter } from './routes/user.routes';
import { subscriptionRouter } from './routes/subscription.routes';
import { connectToDatabase } from './db/mongodb';
import { errorMiddleware } from './middlewares/error.middleware';



export const app = express()


//Express middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

app.use(errorMiddleware)

app.listen(env.PORT, () => {
    console.log(`✅Server running on port ${env.PORT}`)

    connectToDatabase()
})