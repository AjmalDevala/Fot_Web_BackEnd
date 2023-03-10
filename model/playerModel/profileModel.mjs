import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'userData'
  }, 
  profileUrl: {
    type: String,
  },
  position: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  nationality: {
    type: String
  },
  age: {
    type: Number
  },
  height:{ type :Number},
  foot:{type :String},
  currentTeam: {
    type: String,
  },
  previousTeam: [String],
  language: {
    type: [String]
  }, 
  awards: [String],     
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model('profileData', profileSchema)
