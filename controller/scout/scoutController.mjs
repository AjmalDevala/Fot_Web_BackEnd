import scoutModel from "../../model/scoutModel/scoutModel.mjs"
import registerModel from "../../model/scoutModel/RegisterModel.js";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"




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
        const status= await scoutModel.findOne({ $and: [{ email },{ status: "Aproved" }] })
        if (!status) return next(createHttpError(404, "Admin not approved your reqest"));

        const token = jwt.sign({
            scoutId: scout._id,
            fullname: scout.fullname,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(201).json({ scout, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }

}


//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''//
export const register = async (req, res) => {
    const { profileUrl, dateOfBirth, age, nationality, experience, currentClub, pastClub, language, awards, address, description } = req.body
    // const scoutId = req.params.scoutId
    const scoutId = req.decodedToken.scoutId
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
        res.json({ status: "success profile updated", updation: true });
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



export const editAccount = async (req, res, next) => {
    try {
        const scoutId = req.decodedToken.scoutId
        if (!scoutId) return next(createHttpError(401, 'Invalid scoutId'));
        const { fullname, email, phone } = req.body;
        const scout= await scoutModel.find({ _id:scoutId})
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
            return res.status(201).json({msg: "Login successfull.." });
        });
    } catch (error) {
        next(error)
    }

}