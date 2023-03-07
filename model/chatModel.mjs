import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatUsers: {type: Array,required: true},
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    read: { type: Boolean,default: false }
},
    { timestamps: true }
);

export default mongoose.model('chatData', chatSchema) 