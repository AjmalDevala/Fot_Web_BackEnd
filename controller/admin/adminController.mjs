import adminModel from "../../model/adminModel/adminModel.js"
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import userModel from "../../model/playerModel/userModel.mjs";
import scoutModel from "../../model/scoutModel/scoutModel.mjs";
import profileModel from "../../model/playerModel/profileModel.mjs";
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
        const allplayer = await userModel.find();
        if (!allplayer) return next(createHttpError(404, "players not found"));
        const playerData = await profileModel.find();
        const player = await profileModel.find().populate('userId')
        if (!playerData) return next(createHttpError(404, "playerdata not found"));
        res.json({ allplayer, playerData, player });
    } catch (error) {
        next(error)
    }

}
export const allScout = async (req, res, next) => {
    try {
        const allScout = await scoutModel.find();
        if (!allScout) return next(createHttpError(404, "scout not found"));

        res.json(allScout);
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
    console.log(req.params.id, 'ASDFGHJ');
    await scoutModel.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "Aproved" } })
    res.status(200).json({
        status: 'success'
    })
}

export const aproved = async (req, res, next) => {
    console.log(req.params.id, 'ASDFGHJ');
    await scoutModel.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "Pending" } })
    res.status(200).json({
        status: 'success'
    })
}

