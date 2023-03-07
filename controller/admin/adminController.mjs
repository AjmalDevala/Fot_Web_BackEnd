import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import moment from 'moment';
import jwt from "jsonwebtoken"
import adminModel from "../../model/adminModel/adminModel.mjs"
import chatModel from "../../model/chatModel.mjs";
import userModel from "../../model/playerModel/userModel.mjs";
import scoutModel from "../../model/scoutModel/scoutModel.mjs";
import profileModel from "../../model/playerModel/profileModel.mjs";
import registerModel from "../../model/scoutModel/registerModel.mjs";
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
            adminId: admin._id,
            fullname: admin.fullname,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(201).json({ admin, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }
}

export const dashBord = async (req, res, next) => {
    try {
        const allUser = await userModel.find({}).countDocuments()
        const allScout = await scoutModel.find({}).countDocuments()
        const allplayer = await profileModel.find({}).countDocuments()
        res.status(200).json({
            allUser, allplayer, allScout
        })

    } catch (error) {
        next(error)
    }
}

//admin data for 
// .....................................................................................

export const checkAdmin = async (req, res) => {
    let { adminId } = req.decodedToken
    try {
        const admin = await adminModel.findOne({ _id: adminId })
        res.status(200).send({ status: true, admin })
    } catch (error) {
        console.log(error);
    }
    
}



export const chart = async (req, res, next) => {
    try {
        const today = moment().endOf('day');
        const tenDaysAgo = moment().subtract(30, 'days').startOf('day');
        const users = await userModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: tenDaysAgo.toDate(), $lte: today.toDate() },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day',
                        },
                    },
                    count: 1,
                },
            },
        ]);
        res.status(200).json({
            users
        });
    } catch (error) {
        next(error);
    }
};




export const allPlayer = async (req, res, next) => {
    try {
        const allplayer = await userModel.find().sort({ createdAt: -1 })
        if (!allplayer) return next(createHttpError(404, "players not found"));
        const playerData = await profileModel.find();
        const player = await profileModel.find().populate('userId')
        if (!playerData) return next(createHttpError(404, "playerdata not found"));
        const PremiumPlayers = await userModel.find({ premium: true })

        res.json({ allplayer, playerData, player, PremiumPlayers });
    } catch (error) {
        next(error)
    }

}


//.....................................................................................
// check premium player and all scout list also

export const allScout = async (req, res, next) => {
    try {
        const userId = req.decodedToken.userId
        const user = await userModel.find({ _id: userId })
        const allScout = await scoutModel.find().sort({ createdAt: -1 })
        if (!allScout) return next(createHttpError(404, "scout not found"));
        const scout = await registerModel.find().populate("scoutId")
        if (!scout) return next(createHttpError(404, "no scout data...."))
        res.json({ allScout, scout, user });
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
//show
// ........................................

export const connectedPlayers = async (req, res, next) => {
    try {
        const { scoutId } = req.decodedToken
        const scout = await scoutModel.findOne({ _id: scoutId })
        const connectPlayer = scout.connectedPlayers
        res.json({ connectPlayer })
    } catch (error) {
        next(error)
    }
}
// ........................................
export const connectedScoutCheck = async (req, res, next) => {
    try {
        const { userId } = req.decodedToken
        const user = await userModel.findOne({ _id: userId })
        const connectedScout = user.connectedScout
        res.json({ connectedScout })
    } catch (error) {
        next(error)
    }
}

//connected players for chat
// ...................................................

export const connectedScout = async (req, res) => {
    try {
        const { userId } = req.decodedToken
        const connectedScout = await userModel.findOne({ _id: userId }).populate('connectedScout')
        res.status(200).json(connectedScout);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}
//..........................................................................................//\

export const connectedUsers = async (req, res, next) => {
    try {
        const { scoutId } = req.decodedToken
        const connectedPlayers = await scoutModel.findOne({ _id: scoutId }).populate('connectedPlayers')
        res.status(200).json(connectedPlayers);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}


// remoner
//..........................................................................
export const removeUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const scoutId = req.decodedToken.scoutId
        await scoutModel.updateOne(
            { _id: scoutId },
            { $pull: { connectedPlayers: userId } },)
        await userModel.updateOne(
            { _id: userId },
            { $pull: { connectedScout: scoutId } },);
        res.status(200).json({ mgs: 'success' })
    } catch (error) {
        next(error)
    }
}

//send Message
//.........................................................................
export const sendMessage = async (req, res, next) => {
    try {
        const { from, message, to, type } = req.body
        if (!from || !message || !to || !type) {
            return next(createHttpError(401, "Don't send dummy data!"));
        }
        const newMessage = new chatModel({
            message: message,
            chatUsers: [from, to],
            sender: from,
            type
        })
        newMessage.save()
        res.status(201).json(newMessage)

    } catch (error) {
        next(error)
    }
}
//.........................................................................................................??

export const getMessage = async (req, res, next) => {
    try {
        const from = req.params.user1Id
        const to = req.params.user2Id

        const newMessage = await chatModel.find({
            chatUsers: {
                $all: [from, to]
            }
        }).sort({ createdAt: 1 })

        const allMessage = newMessage.map((msg) => {
            return {
                myself: msg.sender.toString() === from,
                message: msg.message,
                type: msg.type
            }
        })
        await chatModel.updateMany({ chatUsers: { $all: [from, to] }, sender: { $ne: from } }, { $set: { read: true } })

        res.status(200).json(allMessage)

    } catch (error) {
        next(error)
    }
}

//unread message 
//................................................................................................................
export const unreadUser = async (req, res, next) => {
    const userId = req.decodedToken.userId
    const count = await chatModel.countDocuments({ chatUsers: userId, sender: { $ne: userId }, read: false });
    res.status(200).json({ count })
}

export const unreadScout = async (req, res, next) => {
    const scoutId = req.decodedToken.scoutId
    // const scoutId = req.params.scoutId
    const count = await chatModel.countDocuments({ chatUsers: scoutId, sender: { $ne: scoutId }, read: false });
    res.status(200).json({ count })
}