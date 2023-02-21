import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'

//   get the token from the authorization header
export const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return next(createHttpError(401, 'Invalid request!'))
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return next(createHttpError(401, 'No token!'))
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.decodedToken = decodedToken;
        next()
    } catch (error) {
        console.log(error);
        return next(error)
    }
}

// otp generating //

export const localVariables = () => {
    req.app.locals = {
        OTP: null,
        resetsession: false
    }
}