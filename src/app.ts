import express from 'express';
import cookieParser from 'cookie-parser'
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { userRouter } from './routes/user.routes';
import { subscriptionRouter } from './routes/subscription.routes';
import { connectToDatabase } from './db/mongodb';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './docs/swagger-output.json'
import { arcjetMiddleware } from './middlewares/arcjet.middleware';
import { workflowRouter } from './routes/workflow.route';


export const app = express()


//Express middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//Arcjet middleware
app.use(arcjetMiddleware)

//Swagger-ui
const options: swaggerUi.SwaggerUiOptions = {
    explorer: true,
    customSiteTitle: 'Subscription Tracker API',
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/workflow', workflowRouter)

app.use(errorMiddleware)

app.listen(env.PORT, () => {
    console.log(`✅Server running on port ${env.PORT}`)

    connectToDatabase()
})