import { ErrorRequestHandler } from "express";

export const ErrorRequestHandler = (err, req, res, next) => {
    console.log(err.message, err.statusCode);
    if (res.headersSent) {
        return next(err);
    }
    
    res
        .status(err.statusCode || 500)
        .json({ message: err.message || "An Unknown Error" })
} 