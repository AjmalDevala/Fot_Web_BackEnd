import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sender: { type:  mongoose.Schema.Types.ObjectId,required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
},
    { timestamps: true }
);

export default mongoose.model('chatData', chatSchema) 