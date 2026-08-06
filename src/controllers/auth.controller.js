import mongoose from "mongoose"
import { academyModel } from "../models/academy.model.js"
import { userModel } from "../models/user.model.js"
import { sessionModel } from "../models/session.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { log } from "console"


async function RegisterUserAcademy(req, res) {

const mongooseSession = await mongoose.startSession();

try {

    const { username, email, password, academyName} = req.body

    if(!username || !email || !password || !academyName) {
        return res.status(400).json({
            message : "Invalid Input"
        })
    }


    const existed_user = await userModel.findOne({
        $or : [ {username}, {email} ]
    })

    if(existed_user) {
        return res.status(400).json({
            message : "User Already Exists"
        })
    }


    mongooseSession.startTransaction()


    const academy = await academyModel.create([{
        name : academyName,
    }], { session : mongooseSession } )

 
    const hashedPassword = await bcrypt.hash(password , 10)

    const user = await userModel.create([{
        username, email, 
        password : hashedPassword, 
        role : "Principal",
        isActive : true,
        isVerified : false,
        academyId : academy[0]._id
    }], {session : mongooseSession } )

    academy[0].owner = user[0]._id

    await academy[0].save({session: mongooseSession})




    const refreshToken = jwt.sign(
            { 
                user : user[0]._id,
                academyId : academy[0]._id
            },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "7d" }
        );

        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

 
    const session = await sessionModel.create([{
        user : user[0]._id,
        refreshToken : hashedRefreshToken,
        academyId : academy[0]._id,
        ip : req.ip,
        userAgent: req.get("user-agent") || "Unknown"
    }], { session : mongooseSession})

    const accessToken = jwt.sign( 
        {  
          user : user[0]._id,
          academyId : academy[0]._id,
          role : user[0].role,
          session : session[0]._id,
          isActive : user[0].isActive
        } 
        ,process.env.JWT_KEY, 
        { expiresIn : "15m" })



    await mongooseSession.commitTransaction()


    res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
    })
        return res.status(201).json({
            message: "Academy registered successfully",
            academyId: academy[0]._id,
            userId: user[0]._id,
            username : user[0].username,
            email : user[0].email,
            academyName : academy[0].name,
            accessToken :  accessToken
        })
        } catch(err) {
            await mongooseSession.abortTransaction()
            return res.status(500).json({
                message : "Internal Server Error",
                error: err.message
            })
        } finally {
            await mongooseSession.endSession()
        }
}

async function login(req, res) {
    
    const { email, password } = req.body

    if( !email || !password) {
        return res.status(400).json({
            message : "Invalid Input"
        })
    }

    const user = await userModel.findOne({
        email
    })



    if(!user) {
        return res.status(400).json({
            message : "Invalid Email ,User does not Exist"
        })
    }

    const isPasswordValid = await bcrypt.compare(
    password,
    user.password
    );

    if (!isPasswordValid) {
    return res.status(401).json({
        message: "Invalid password"
    });
    }

    const academy = await academyModel.findOne({
        _id : user.academyId
    })

    // TILL


    const refreshToken = jwt.sign(
            { 
                user : user._id,
                academyId : academy._id
            },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "7d" }
        );

        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

 
    const session = await sessionModel.create({
        user : user._id,
        refreshToken : hashedRefreshToken,
        ip : req.ip,
        academyId : academy._id,
        userAgent: req.get("user-agent") || "Unknown"
    } )

        const accessToken = jwt.sign( 
        {  
          user : user._id,
          academyId : academy._id,
          role : user.role,
          session : session._id,
          isActive : user.isActive
        } 
        ,process.env.JWT_KEY, 
        { expiresIn : "15m" })


    res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
    })
        return res.status(201).json({
            message: "User Logged-In successfully",
            academyId: academy._id,
            userId: user._id,
            username : user.username,
            email : user.email,
            academyName : academy.name,
            accessToken :  accessToken
        })
    
}

async function RegisterController(req, res) {

try {

    const academy_id = req.academyId


        if (!academy_id) {
            return res.status(401).json({
                message: "Academy authentication required"
            })
        }

    const { username, email, password} = req.body


    if (req.role !== "Principal") {
        return res.status(403).json({
        message: "Only principal can create admin accounts"
        })
    }


    if(!username || !email || !password) {
        return res.status(400).json({
            message : "Something is missing"
        })
    }


    const existed_user = await userModel.findOne({
        $or : [ {username}, {email} ]
    })

    if(existed_user) {
        return res.status(400).json({
            message : "User Already Exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password , 10)

    const user = await userModel.create({
        username, email,
        academyId : academy_id, 
        password : hashedPassword, 
        role : "Admin",
        isActive : true,
        isVerified : false
    })
    
    res.status(201).json({
        message : "User Created Successfully",
        username : user.username,
        role : user.role,
        isActive : user.isActive,
        isVerified : user.isVerified

    })

} catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error: err.message
    })
}

}

async function refreshToken(req, res) {

    try {
 
    const refreshToken = req.cookies.refreshToken



    if(!refreshToken) {
        return res.status(400).json({
            message : "RefreshToken is required"
        })
    }

    const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

    const session = await sessionModel.findOne({
        refreshToken : hashedRefreshToken,
        revoked : false
    })

    if(!session) {
        return res.status(400).json({
            message : "RefreshToken is Invalid or Revoked"
        })
    }

    const user = await userModel.findById(session.user)



    const newRefreshToken = jwt.sign(
            { 
            user : user._id,
            academyId : user.academyId,
             },
            
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "7d" }
        );

        const newHashedRefreshToken = crypto
                .createHash("sha256")
                .update(newRefreshToken)
                .digest("hex");

        session.refreshToken = newHashedRefreshToken;
        await session.save();

        res.cookie("refreshToken", newRefreshToken , {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        const accessToken = jwt.sign( 
        {  
          user : user._id,
          academyId : user.academyId,
          role : user.role,
          session : session._id,
          isActive : user.isActive
        } 
        ,process.env.JWT_KEY, 
        { expiresIn : "15m" })


        return res.status(200).json({
            message : "Successfully AccessToken Fetched",
            accessToken : accessToken
        })

        } catch(err) {
            return res.status(400).json({
                message : "Internal Server Error",
                error : err.message
            })
        }
  
}

async function getMe(req, res) {
    res.status(200).json({
        User : req.user,
        Academy : req.academyId
    })

    

    

}

async function logout(req, res) {

try {

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) {
        return res.status(400).json({
            message : "RefreshToken is required"
        })
    }

    const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

    const session = await sessionModel.findOne({
        refreshToken : hashedRefreshToken,
        revoked : false
    })

    if(!session) {
        return res.status(400).json({
            message : "RefreshToken is Invalid or Revoked"
        })
    }

    session.revoked = true;
    await session.save();


    res.clearCookie("refreshToken")

    return res.status(200).json({ message: 'Logged out successfully' });

    } catch(err) {
        res.status(500).json({
            message : "Internal Server Error",
            error : err.message
        })
    }
    
}

async function logoutAll(req, res) {
try {

    
    await sessionModel.updateMany(
    {
        user: req.user,
        revoked: false
    },
    {
        $set: {
            revoked: true
        }
    }
);

    res.clearCookie("refreshToken")

    return res.status(200).json({ message: 'Logged out successfully from all Devices' });

    } catch(err) {
        res.status(500).json({
            message : "Internal Server Error",
            error : err.message
        })
    }
}

async function logoutAcademy(req, res) {
 try {

    const role = req.role

    if(role !== "Principal") {
        return res.status(403).json({
            message : "Only Principal can perform this action"
        })
    }

    await sessionModel.updateMany(
    {
        academyId: req.academyId,
        revoked: false
    },
    {
        $set: {
            revoked: true
        }
    }
);

    res.clearCookie("refreshToken")

    return res.status(200).json({ message: 'All Devices from this Academy has been Logged out' });

    } catch(err) {
        res.status(500).json({
            message : "Internal Server Error",
            error : err.message
        })
    }   
}



export {RegisterController, RegisterUserAcademy,login , refreshToken, logout, logoutAll,logoutAcademy ,getMe}