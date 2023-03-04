import mongoose from "mongoose";

 const userSchema =new mongoose.Schema({
    fullname : {
        type :String,
        required : true
    },
    email : {
        type :String,
        require :true,
        unique :true
    },
    password :{
        type :String,
        require :[true,["place Enter password"]],
        unique :false
    },
    phone : {
        type : Number,
        require:[true,["place enter phone number"]]

    },
    status   :{
        type : String,
        default :"unBlock"

    },
    premium :{
        type:Boolean,
        default :false
    },
    connectedScout :[{
        type:mongoose.Schema.Types.ObjectId,
        ref  :"ScoutData"
    }]
    
},{timestamps:true})
export default mongoose.model('userData',userSchema)
