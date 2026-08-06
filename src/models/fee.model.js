import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({

    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
        required : true
    },
    month : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pending : {
        type : Number,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },

}, {timestamps : true} )

export const feeModel = mongoose.model("fee", feeSchema)