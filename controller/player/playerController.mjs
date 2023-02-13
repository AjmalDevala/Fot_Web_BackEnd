import userModel from "../../model/playerModel/userModel.mjs"
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

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

export const sendOtp = async (req, res,next) => {
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
      }catch (error){
       next (error)
    }
}

   //resend otp
   export const resendotp= (req, res,next) => {
    try{
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
        res.render('otp', { msg: "otp has been sent",Email });
    });
}catch{
    res.render("error")
}
}


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




// user Signup
// export const userSignup = async (req, res, next) => {
//     const fullname = req.body.values.fullname;
//     const email = req.body.values.email;
//     const passwordRaw = req.body.values.password;
//     const phone = req.body.values.phone;
//     try {
//         console.log(req.body);
//         const existingEmail = await userModel.findOne({ email }).exec()
//         if (existingEmail) return next(createHttpError(409, "Email address is already taken. Please choose another one or log in instead"));
//         const hashedPassword = await bcrypt.hash(passwordRaw, 10);
//         const newUser = await userModel.create({
//             fullname,
//             email,
//             phone,
//             password: hashedPassword,
//         })
//         return res.status(200).json({ newUser, msg: "user register successfully" });
//     } catch (error) {
//         next(error)
//     }
// }




// user login

export const userLogin = async (req, res, next) => {
    const email = req.body.values.email;
    const passwordRaw = req.body.values.password
    try {
        const user = await userModel.findOne({ email })
        if (!user) return next(createHttpError(404, "User not found"));
        const passwordValidate = await bcrypt.compare(passwordRaw, user.password)
        if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
        const token = jwt.sign({
            userId: user._id,
            fullname: user.fullname,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(201).json({ fullname: user.fullname, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }
}


