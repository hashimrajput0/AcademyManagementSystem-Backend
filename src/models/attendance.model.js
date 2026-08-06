import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },

        date: {
            type: Date,
            required: true
        },
        academy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Academy",
            required: true
        },

        students: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student",
                    required: true
                },

                status: {
                    type: String,
                    enum: ["present", "absent", "leave"],
                    required: true
                }
            }
        ],

        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

attendanceSchema.index(
    { class: 1, date: 1 },
    { unique: true }
);

export const attendanceModel = mongoose.model(
    "Attendance",
    attendanceSchema
);