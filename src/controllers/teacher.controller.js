import { teacherModel } from "../models/teacher.model.js"



async function createTeacher(req, res) {

try {

    const academyId = req.academyId

    const { name, qualification, salary, subjects, joiningDate, status  } = req.body

    if (!name || salary === undefined || !subjects) {
            return res.status(400).json({
                message: "Enter name, subjects and salary."
            });
        }

    if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({
                message: "At least one subject is required."
            });
    }

    const teacher = await teacherModel.create({
        name, qualification, salary, subjects, joiningDate, status,
        academy : academyId
    })

    return res.status(201).json({
        message : "Successfully Teacher Created",
        teacher
    })
} catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
}
}

async function deleteTeacher(req,res) {

    try {
    const academyId = req.academyId
    const userRole = req.role

    if(userRole !== "Principal") {
        return res.status(400).json({
            message : "Only Principal can delete Teacher"
        })
    }

    const { teacherId } = req.body

    if (!teacherId) {
    return res.status(400).json({
        message: "Teacher ID is required."
    });
}

    const teacher = await teacherModel.deleteOne({
        _id : teacherId,
        academy : academyId
    })

    if(teacher.deletedCount === 0) {
        return res.status(400).json({
            message : "Teacher not found"
        })
    }

    return res.status(200).json({
        message : "Successfully Deleted",
    })
 
    } catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
    }
    
}

async function getAllTeacher(req, res) {

    try {

    const academyId = req.academyId

    const teachers = await teacherModel.find({
        academy : academyId
    })

    return res.status(200).json({
        message : "All Teachers Fetched Successfully",
        teachers
    })


    } catch(err) {
        return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
    }
}

export { createTeacher, deleteTeacher, getAllTeacher }