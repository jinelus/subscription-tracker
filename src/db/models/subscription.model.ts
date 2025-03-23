import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'BRL'],
        default: 'BRL',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment', 'health', 'education', 'other'],
        default: 'other',
        required: [true, 'Subscription category is required'],
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bank', 'paypal', 'boleto'],
        default: 'card',
        trim: true,
        required: [true, 'Subscription payment method is required'],
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value: Date) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        required: false,
        validate: {
            validator: function (value: Date): boolean {
                return value > (this as any).startDate;
            },
            message: 'Start date must be in the past'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true })

subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }

        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency])
    }

    // Auto update the renewal date when the subscription is updated
    if(this.renewalDate < new Date()){
        this.status = 'expired'
    }

    next()
})

export const Subscription = mongoose.model('Subscription', subscriptionSchema)