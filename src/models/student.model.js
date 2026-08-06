import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true
    },
    fatherName: {
      type: String,
      trim: true,
    },
    academy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Academy",
      required: true,
    },
    class : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "class",
    },
    roll : {
        type : String,
    },
    phone : {
        type : String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "left"],
      default: "active",
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },

}, { timestamps : true } )

export const studentModel = mongoose.model("Student", studentSchema)