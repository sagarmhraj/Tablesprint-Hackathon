import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const genToken = asyncHandler(async(id) => {
    return await jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: 24*60*60
    })
})