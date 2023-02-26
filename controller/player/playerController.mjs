import userModel from "../../model/playerModel/userModel.mjs"
import profileModel from "../../model/playerModel/profileModel.mjs"
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import registerModel from "../../model/scoutModel/RegisterModel.js";


// ....................................................................................//
// otp creating number
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

let Fullname;
let Email;
let Phone;
let Password;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",

    auth: {
        user: "fotweb08@gmail.com",
        pass: "fhtrpmujqbqufwzy",
    },
});
// .......................................................................//
// send otp
export const sendOtp = async (req, res, next) => {
    Fullname = req.body.values.fullname;
    Email = req.body.values.email;
    Phone = req.body.values.phone;
    Password = req.body.values.password;
    try {
        const existingEmail = await userModel.findOne({ email: Email }).exec()
        if (existingEmail) return next(createHttpError(409, "Email address is already taken. Please choose another one or log in instead"));
        if (!existingEmail) {
            var mailOptions = {
                to: req.body.values.email,
                subject: "OTP FOR footballplayer registration is: ",
                html:
                    "<h3>OTP for FoT-web account verification is </h3>" +
                    "<h1 style='font-weight:bold;'>" +
                    otp +
                    "</h1>", // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                res.json({
                    status: "success",
                });
            });
        }
    } catch (error) {
        next(error)
    }
}
// ............................................................................//
// resendOtp

export const resendOtp = (req, res, next) => {
    try {
        var mailOptions = {
            to: Email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp', { msg: "otp has been sent" });
        });
    } catch (error) {
        error
    }

}
// ...................................................................................................//
// user SignUp

export const userSignup = async (req, res) => {
    let userOtp = req.body.otpvalue
    console.log(userOtp);

    if (userOtp == otp) {
        const newUser = userModel({
            fullname: Fullname,
            email: Email,
            phone: Phone,
            password: Password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(() => {

                        res.json({ newUser, status: "success" });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({ status: failed })
                    })
            })
        })
    }
}


// .....................................................................................
// user login

export const userLogin = async (req, res, next) => {
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password
    try {
        const user = await userModel.findOne({ email })
        if (!user) return next(createHttpError(404, "User not found"));
        const passwordValidate = await bcrypt.compare(passwordRaw, user.password)
        if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
        const status= await userModel.findOne({ $and: [{ email },{ status: "unBlock" }] })
        if(!status) return next(createHttpError(400,"Admin Blocked You...."))
        const token = jwt.sign({
            userId: user._id,
            fullname: user.fullname,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(201).json({ user, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }
}


//...................................................................................................
// edit userAccount

export const editAccount = async (req, res, next) => {
    try {
        const userId = req.decodedToken.userId
        const { fullname, email, phone } = req.body;
        const saveUserEdits = await userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    fullname,
                    email,
                    phone,
                },
            }
        );
        await saveUserEdits.save().then(() => {
            return res.status(201).json({  msg: "Accound updated.." });
        });
    } catch (error) {
        next(error)
    }

}

// .....................................................................//
// player Profile  creating or updating

export const profile = async (req, res) => {
    const { profileUrl, position, dateOfBirth, nationality, age, height, foot, currentTeam, previousTeam, language, awards, address, description } = req.body
    const userId = req.params.userId
    // const data = req.decodedToken.userId
    try {
        const profile = await profileModel.findOne({ userId }) 
        if (!profile) {
            const newprofile = new profileModel({
                userId,
                profileUrl,
                position,
                dateOfBirth,
                nationality,
                age,
                height,
                foot,
                currentTeam,
                previousTeam,
                language,
                nationality,
                awards,
                address,
                description

            });
            await newprofile.save()
        } else {
            const editprofile = await profileModel.findOneAndUpdate({ userId }, {
                profileUrl,
                position,
                dateOfBirth,
                nationality,
                age,
                height,
                foot,
                currentTeam,
                previousTeam,
                language,
                nationality,
                awards,
                address,
                description

            });
            await editprofile.save()
        }
        res.json({ status: "success profile updated",updation:true });
    } catch (error) {
        res.status(400).send({ status: false, error: "Server Issue" });
    }

}


//....................................................................................??


export const showProfile = async (req, res, next) => {
    try {
        const userId = req.decodedToken.userId
        if (!userId) return next(createHttpError(401, 'Invalid userId'));
        const user = await userModel.findOne({ _id: userId })
        const userData= await profileModel.findOne({ userId:userId })
        res.status(200).send({ status: true, user ,userData});;
    } catch (error) {
        res.status(400).send({ status: false, error: "Server Issue" });
    }
}


//........................................................................................//
//show the Scout id

export const singleScout =async(req,res,next)=>{
    try {
        const scoutId=req.params.scoutId
        if(!scoutId) return next (createHttpError(401,'invalid ScoutId'))
         const scout =await registerModel.findOne({scoutId:scoutId}).populate("scoutId")
         if (!scout) return next (createHttpError(401,"no scout...."))
         res.status(200).send({scout})
    } catch (error) {
        res.status(400).send({ status: false, error: "Server Issue" });
    }
}

//....................................................................................//
// connectScout
export const connectScout = async (req, res, next) => {
    try{
       const playerId = req.query.playerId
       if (!playerId) return next(createHttpError(404, "Invalid player Id"))
        const scoutId = req.query.scoutId
        if (!scoutId) return next(createHttpError(404,"invalid scout Id"))
        const exitScout =await userModel.find({connectedScout:scoutId})
        if (exitScout) return next (createHttpError(400,("your Request alredy send")))
        await  userModel.findOneAndUpdate({_id:playerId},{$push:{connectedScout:scoutId}})
    .then(()=>{
       return res.status(201).json({ msg: "you request sended.." });
    })
   }catch(error){
       next(error)
   }
   }

//......................................................................................................//
// premium player

export  const premiumPlayer= async(req,res,next)=>{
    try {
     const userId = req.params.userId
     const user = await userModel.find({_id:userId})
        if(!userId) return (createHttpError(404,"user Not Found"))  ; 
        await userModel.findByIdAndUpdate({ _id: userId }, { $set: { premium: true } })
        .then(()=>{
            return res.status(201).json({ msg: "Now your a Premium Member" ,user});
         })
    } catch (error) {
        next(error) 
    }

}