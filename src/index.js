require('dotenv').config();
const express = require('express')
const app = express();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisclient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');




app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);

const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(),redisclient.connect()]);
        console.log("Connected to DB and Redis Successfully");
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }

    catch(err){
        console.log("Error Occurred: "+err);
    }
}

InitalizeConnection();
