import mongoose from "mongoose";

const galleryModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'userData'
      }, 
     imageUrl:[{
        type: String, 
      }]

})
export default mongoose.model('galleryData', galleryModel)