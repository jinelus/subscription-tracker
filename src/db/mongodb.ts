import { env } from "@/config/env"
import mongoose from "mongoose"

if(!env.DATABASE_URL){
    throw new Error('DATABASE_URL MongoDB is not defined')
}

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(env.DATABASE_URL);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);

        process.exit(1);
    }
}