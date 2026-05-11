const jwt=require('jsonwebtoken');
const redisclient = require('../config/redis');
const user = require('../models/user');


const userMiddleware = async (req,res,next)=>{

    try{
        const {token} = req.cookies;
        if(!token)
            throw new Error("Unauthorized User");


        const payload = jwt.verify(token, process.env.JWT_KEY);

        const {_id} = payload;

        if(!_id){
            throw new Error("Unauthorized User");
        }


        const result = await user.findById(_id);

        if(!result){
            throw new Error("Unauthorized User");
        }

        const Isblocked = await redisclient.exists(`token:${token}`);
        if(Isblocked)
            throw new Error("invalid token");
         req.result = result;
         next();


    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}

module.exports = userMiddleware;