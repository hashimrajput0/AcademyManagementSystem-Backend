import mongoose from "mongoose";

const classSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true
    },
    section : {
        type : String,
        trim : true
    },
    academy: {
        type: mongoose.Schema.Types.ObjectId,
          ref: "Academy",
          required: true,
    },
    teachers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

    academicYear : {
        type : String,
    }

}, { timestamps : true } )


export const classModel = mongoose.model("Class", classSchema)