import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'userData'
       },
    position: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age:{
        type :Number
    },
    profile:{
        type :String,
    },
    currentTeam: {
      type: String,
    },
    language :{
      type : [String]
    },
    previousTeam: [String],
    awards: [String],
    description: {
      type: String,
      default: "",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  });
  

  export default mongoose.model('profileData',profileSchema)
