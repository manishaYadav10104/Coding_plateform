const jwt = require("jsonwebtoken")
const user = require("../models/user")
const redisClient = require("../config/redis")


const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("token is missing");

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) throw new Error("Invalid payload ID");

        const result = await user.findById(_id);
        if(payload.role != 'admin') throw new Error("Invalid token")
        if (!result) throw new Error("User not found");

        // redis check for blocked token
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) throw new Error("Invalid Token")

        req.result = result;
        next();

    }
    catch (err) {
    console.error("ADMIN ERROR:", err); // 👈 ADD

    return res.status(401).json({
        success: false,
        message: err.message
    });
}
}
module.exports = adminMiddleware;