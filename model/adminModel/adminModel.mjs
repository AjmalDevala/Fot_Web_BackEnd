import mongoose from "mongoose";

 const adminSchema =new mongoose.Schema({
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

    }
    
})
export default mongoose.model('adminData',adminSchema)
