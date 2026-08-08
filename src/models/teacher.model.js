import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    qualification : {
        type : String,
    },
    salary : {
        type : Number
    },
    academy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Academy",
        required: true
    },
    subjects: [
        {
            type: String,
            trim: true
        }
    ],
    joiningDate: {
            type: Date
    },
    status: {
            type: String,
            enum: ["active", "inactive", "on_leave"],
            default: "active"
    }

})


export const teacherModel = mongoose.model("Teacher", teacherSchema)