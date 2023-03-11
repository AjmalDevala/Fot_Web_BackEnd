import scoutModel from "../../model/scoutModel/scoutModel.mjs"
import registerModel from "../../model/scoutModel/registerModel.mjs";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import profileModel from "../../model/playerModel/profileModel.mjs";
import notificationModel from "../../model/notificationModel.mjs";
import userModel from "../../model/playerModel/userModel.mjs";
import galleryModel from "../../model/playerModel/galleryModel.mjs";


//......................................................................................//
// scout Signup
export const scoutSignup = async (req, res, next) => {
    const fullname = req.body.values.fullname;
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password;
    const phone = req.body.values.phone;
    try {
        console.log(req.body);
        const existingEmail = await scoutModel.findOne({ email }).exec()
        if (existingEmail) return next(createHttpError(409, "Email address is already taken. Please choose another one or log in instead"));
        const hashedPassword = await bcrypt.hash(passwordRaw, 10);
        const newScout = await scoutModel.create({
            fullname,
            email,
            phone,
            password: hashedPassword,
        })
        return res.status(201).json({ newScout, msg: "user register successfully" });
    } catch (error) {
        next(error)
    }
}

//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''//
// scout login

export const scoutLogin = async (req, res, next) => {
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password
    try {
        const scout = await scoutModel.findOne({ email })
        if (!scout) return next(createHttpError(404, "Scout not found"));
        const passwordValidate = await bcrypt.compare(passwordRaw, scout.password)
        if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
        const token = jwt.sign({
            scoutId: scout._id,
            fullname: scout.fullname,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(201).json({ token, scout, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }

}

// protuct router
// ......................................
export const checkScout = async (req, res) => {
    let { scoutId } = req.decodedToken
    try {
        const scout = await scoutModel.findOne({ _id: scoutId })
        res.status(200).send({ status: true, scout })
    } catch (error) {
        console.log(error);
    }
    
}

//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''//
export const register = async (req, res) => {
    const { profileUrl, dateOfBirth, age, nationality, experience, currentClub, pastClub, language, awards, address, description } = req.body
    const scoutId = req.decodedToken.scoutId
    const scout = await scoutModel.findOne({ _id: scoutId })
    const register = await registerModel.findOne({ scoutId })
    try {
        if (!register) {
            const newregister = new registerModel({
                scoutId,
                profileUrl,
                dateOfBirth,
                age,
                nationality,
                experience,
                currentClub,
                pastClub,
                language,
                nationality,
                awards,
                address,
                description

            });
            await newregister.save()
        } else {
            const register = await registerModel.findOneAndUpdate({ scoutId }, {
                profileUrl,
                dateOfBirth,
                age,
                nationality,
                experience,
                currentClub,
                pastClub,
                language,
                nationality,
                awards,
                address,
                description

            });
            await register.save()
        }
        res.json({ scout, updation: true });
    } catch (error) {
        res.status(400).send({ status: false, error: "Server Issue" });
    }

}

export const showProfile = async (req, res, next) => {
    try {
        const scoutId = req.decodedToken.scoutId
        if (!scoutId) return next(createHttpError(401, 'Invalid scoutId'));
        const scoutData = await registerModel.findOne({ scoutId: scoutId })
        const scout = await scoutModel.findOne({ _id: scoutId })
        if (!scoutData) return next(createHttpError(401, 'Invalid scoutData'));
        res.status(200).send({ status: true, scout, scoutData });;
    } catch (error) {
        res.status(400).send({ status: false, error: "Server Issue" });
    }
}
//edit accound in use sioe
export const editAccount = async (req, res, next) => {
    try {
        const scoutId = req.decodedToken.scoutId
        if (!scoutId) return next(createHttpError(401, 'Invalid scoutId'));
        const { fullname, email, phone } = req.body;
        const scout = await scoutModel.find({ _id: scoutId })
        const scoutEdits = await scoutModel.findOneAndUpdate(
            { _id: scoutId },
            {
                $set: {
                    fullname,
                    email,
                    phone,
                },
            }
        );
        await scoutEdits.save().then(() => {
            return res.status(201).json({ scout, msg: "Login successfull.." });
        });
    } catch (error) {
        next(error)
    }
}

//.............................................................................................//
//single player page 


export const singlePlayer = async (req, res, next) => {
    try {
        const playerId = req.params.playerId
        if (!playerId) return next(createHttpError(401, 'invalid PlayerId'))
        const player = await profileModel.findOne({ userId: playerId }).populate("userId")
        if (!player) return next(createHttpError(401, "no player...."))
        const gallery =await galleryModel.find({userId:playerId})
        res.status(200).send({ player,gallery })
    } catch (error) {
        res.status(400).send({ status: false, error: "Server Issue" });
    }
}


//...............................................................................................//
//add players connection// 

export const connectPlayer = async (req, res, next) => {
    try {
        const scoutId= req.decodedToken.scoutId
        if (!scoutId) return next(createHttpError(404, "Invalid user Id"))
        const {userId} = req.query
        if (!userId) return next(createHttpError(404, "invalid scout Id"))
        const exitPlayer = await scoutModel.findOne({ _id: scoutId, connectedPlayers: { $in: [userId] } })
        if (exitPlayer) return next(createHttpError(401, "your request alredy send"))
        await scoutModel.findOneAndUpdate({ _id: scoutId }, { $addToSet: { connectedPlayers: userId } })
        await userModel.findOneAndUpdate({ _id: userId }, { $addToSet: { connectedScout: scoutId } })
            .then(() => {
                res.status(200).send({ msg:"succes" })
            })
    } catch (error) {
        next(error)
    }
}



//.......................................Notification....................................................................//

export const notification = async (req,res,next)=>{
    try {
    const scoutId = req.decodedToken.scoutId
    console.log(scoutId)
    const send = await notificationModel.findOne()
    } catch (error) {
        
    }
}