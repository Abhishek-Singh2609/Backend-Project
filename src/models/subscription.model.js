import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing  Note: subscriber is also a user.
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing Note: channel is also a user. 
        ref: "User"
    }
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)