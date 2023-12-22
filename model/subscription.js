const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: Boolean,
        default: true, 
    },
    billingHistory: [
        {
            date: Date,
            plan:String,
            amount: String,
            billingCycle:String,
            billingId:String,
            charge_id:String,
        },
    ],

}, { timestamps: true });

module.exports = mongoose.model('subscription', subscriptionSchema);