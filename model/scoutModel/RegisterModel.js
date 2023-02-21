import mongoose from "mongoose";

const registerModelSchema = new mongoose.Schema({
  scoutId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ScoutData'
  }, 
  profileUrl: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number
  },
  nationality: {
    type: String
  },
  experience: {
    type: String
  },
  currentClub: {
    type: String,
  },
  pastClub:[String],
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


export default mongoose.model('RegisterData', registerModelSchema)

