import adminModel from "../../model/adminModel/adminModel.js"
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import chatModel from "../../model/chatModel.mjs/";
import userModel from "../../model/playerModel/userModel.mjs";
import scoutModel from "../../model/scoutModel/scoutModel.mjs";
import profileModel from "../../model/playerModel/profileModel.mjs";
import registerModel from "../../model/scoutModel/RegisterModel.js";
// admin login

export const adminLogin = async (req, res, next) => {
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password
    try {
        const admin = await adminModel.findOne({ email })
        if (!admin) return next(createHttpError(404, "Admin not found"));
        const passwordValidate = await bcrypt.compare(passwordRaw, admin.password)
        if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
        const token = jwt.sign({
            userId: admin._id,
            username: admin.fullname,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(201).json({ fullname: admin.fullname, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }
}

export const dashbord = async (req, res, next) => {
    const allUser = await userModel.find({}).countDocuments()
    const allScout = await scoutModel.find({}).countDocuments()
    const allplayer = await profileModel.find({}).countDocuments()
    res.status(200).json({
        allUser, allplayer, allScout
    })
}

export const allplayer = async (req, res, next) => {
    try {
        const allplayer = await userModel.find().sort({createdAt:-1})
        if (!allplayer) return next(createHttpError(404, "players not found"));
        const playerData = await profileModel.find();
        const player = await profileModel.find().populate('userId')
        if (!playerData) return next(createHttpError(404, "playerdata not found"));
        const PremiumPlayers =await userModel.find({premium:true})
        res.json({ allplayer, playerData, player,PremiumPlayers });
    } catch (error) {
        next(error)
    }

}
//.....................................................................................
// check premium player and all scout list also

export const allScout = async (req, res, next) => {
    try {
        const userId = req.query.userId
        const user=await userModel.find({_id:userId})
        const allScout = await scoutModel.find().sort({createdAt:-1})
        if (!allScout) return next(createHttpError(404, "scout not found"));
        const scout =await registerModel.find().populate("scoutId")
        if(!scout ) return next (createHttpError(404,"no scout data...."))
        res.json({allScout ,scout,user});
    } catch (error) {
        next(error)
    }
}


//........................................................................................//
// block and unblock
export const unBlockUser = async (req, res, next) => {
    await userModel.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "unBlock" } })
    res.status(200).json({
        status: 'success'
    })
}
export const blockUser = async (req, res, next) => {
    await userModel.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "Block" } })
    res.status(200).json({
        status: 'success'
    })
}


//.....................................................................................//
//scot management
export const pending = async (req, res, next) => {
    await scoutModel.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "Aproved" } })
    res.status(200).json({
        status: 'success'
    })
}

export const aproved = async (req, res, next) => {
    await scoutModel.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "Pending" } })
    res.status(200).json({
        status: 'success'
    })
}
//...................................................................................................??
// chat  user and scout

export const connectedScout = async (req, res ) => {
    try {
      const { userId } = res.decodedToken
      const connectedScout = await userModel.findById(userId).populate('connectedScout');
      res.status(200).json(connectedScout);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }
  //..........................................................................................//\

export const connectedplayers = async (req, res ) => {
    try {
      const { scoutId } = res.decodedToken
      const connectedPlayers = await scoutModel.findById(scoutId).populate('connectedPlayers');
      res.status(200).json(connectedPlayers);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }

  //.........................................................................................................??

export const getMessage = async (req, res, next) => {
    try {
        const {userId} = res.decodedToken;
        const to = req.query.to;
        console.log(userId,to,'logged here');
        
        const messages = await chatModel.find({
            $or: [
                { $and: [{ sender: userId }, { receiver: to }] },
                { $and: [{ sender: to }, { receiver: userId }] }
            ]  
        }) 
        const allMessages = messages.map((msg) => {
            return {
                id:msg._id,
                myself: msg.sender.toString() === userId,
                message: msg.message
            }
        })
        res.status(200).json(allMessages)
    } catch (error) {
        return next(InternalServerError)
    }
}


export const sendMessage = async (req, res, next) => {
    try {
        const { userId } = res.decodedToken;
        if (!userId) return next(createHttpError(401, "unauthorized user!"))
        const { messages, to } = req.body
        
        const newMessage = new chatModel({
            sender: userId,
            receiver: to,
            message:messages
        })
        newMessage.save()
        res.status(201).json(newMessage)

    } catch (error) {
        return next(InternalServerError)
    }
}