import scoutModel from "../../model/scoutModel/scoutModel.mjs"
import createHttpError  from "http-errors";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken"





// scout Signup
export const scoutSignup = async (req,res,next) => {
    const fullname = req.body.values.fullname;
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password;
    const phone = req.body.values.phone;
    try {
        console.log(req.body);
        const existingEmail = await scoutModel.findOne({email }).exec()
        if(existingEmail) return next(createHttpError(409,"Email address is already taken. Please choose another one or log in instead"));
        const hashedPassword = await bcrypt.hash(passwordRaw,10);
        const newScout = await scoutModel.create({
            fullname,
            email,
            phone,
            password:hashedPassword,
        })        
        return res.status(201).json({newScout,msg:"user register successfully"}); 
    } catch (error) {
        next(error)
    }
}


// scout login

export const scoutLogin = async (req,res,next)=>{
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password
    try {
        const scout = await scoutModel.findOne({email})        
        if(!scout) return next(createHttpError(404,"Scout not found"));
        // const passwordValidate = await bcrypt.compare(passwordRaw,scout.password)
        // if(!passwordValidate) return next(createHttpError(404,"Password does not match"));
        const token = jwt.sign({ 
            userId:scout._id,  
            username:scout.fullname, 
        },process.env.JWT_SECRET,{expiresIn : "24h"})
        return res.status(201).json({fullname:scout.fullname,token,msg:"Login successfull.."});
    } catch (error) { 
        next(error)   
    } 
    
}