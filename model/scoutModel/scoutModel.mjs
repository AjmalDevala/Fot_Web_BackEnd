import mongoose from "mongoose";

const scoutSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        unique: false
    },
    phone: {
        type: Number,
        require: [true, ["please enter phone number"]]

    },
    status: {
        type: String,
        default: "Pending"

    }, connectedPlayers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData"
    }
    ]
}, {timestamps: true});
export default mongoose.model('ScoutData', scoutSchema)
