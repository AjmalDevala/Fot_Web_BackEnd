import adminModel from "../../model/adminModel/adminModel.js"
import createHttpError  from "http-errors";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken"

// admin login

export const adminLogin = async (req,res,next)=>{
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password
    try {
        const admin = await adminModel.findOne({email})        
        if(!admin) return next(createHttpError(404,"Admin not found"));
        const passwordValidate = await bcrypt.compare(passwordRaw,admin.password)
        if(!passwordValidate) return next(createHttpError(404,"Password does not match"));
        const token = jwt.sign({ 
            userId:admin._id,  
            username:admin.fullname, 
        },process.env.JWT_SECRET,{expiresIn : "24h"})
        return res.status(201).json({fullname:admin.fullname,token,msg:"Login successfull.."});
    } catch (error) { 
        next(error)   
    } 
}