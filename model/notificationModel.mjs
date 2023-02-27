import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: { type:  mongoose.Schema.Types.ObjectId,ref: 'userData',required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId,ref: 'scoutData', required: true },
    status:{
        type: String,
        default:"Pending"
    }
},
    { timestamps: true }
);

export default mongoose.model('notification', notificationSchema) 