import mongoose, { Mongoose } from "mongoose"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        unique: true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique: true
    },
    password : {
        type : String,
        required : true,
        trim: true
    },
    isActive : {
        type : Boolean,
        default : true
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    role : {
        type : String,
        enum : ["Principal","Admin"]
    },
    academyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Academy",
        required : true
    }
}, { timestamps : true })

export const userModel = mongoose.model("User", userSchema)