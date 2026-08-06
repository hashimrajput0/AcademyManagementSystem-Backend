import mongoose from "mongoose";

const academySchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }

}, { timestamps : true})

export const academyModel = mongoose.model("Academy", academySchema)