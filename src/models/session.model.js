import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    academyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Academy"
    },
    refreshToken : {
        type : String,
        required : true
    },
    ip : {
        type : String,
    },
    userAgent : {
        type : String,
        default: "Unknown"
    },
    revoked : {
        type : Boolean,
        default : false
    }

}, { timestamps : true } )


sessionSchema.index({ academyId: 1, revoked: 1 });
sessionSchema.index({ user: 1, revoked: 1 });
sessionSchema.index({ refreshToken: 1 });

export const sessionModel = mongoose.model("Session", sessionSchema)