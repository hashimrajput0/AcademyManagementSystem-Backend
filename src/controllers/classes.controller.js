import { classModel } from "../models/class.model.js"



async function createClass(req, res) {

    try {

    const academyId = req.academyId

    const { name, section, academicYear, teachers } = req.body


    if (!name || !section || !academicYear) {
            return res.status(400).json({
                message: "Name, section and academic year are required."
            });
    }

    const Class = await classModel.create({

        name, section, academicYear, teachers,
        academy : academyId

    })

    return res.status(201).json({
        message : "Successfully Created Class",
        Class
    })

    
} catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
}
}


async function getClasses(req, res) {

    try {
    const academyId = req.academyId

    const classes = await classModel.find({
        academy : academyId
    })

    return res.status(200).json({
        message : "All Classes Fetched Successfully",
        classes
    })


    } catch(err) {
        return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
    }

}


async function DeleteClass(req, res) {

    try {

    const academyId = req.academyId
    const userRole = req.role

    const { classId } = req.body

    if(userRole !== "Principal") {
        return res.status(400).json({
            message : "Only Principal can delete class"
        })
    }

    const deletedClass = await classModel.deleteOne({
        _id : classId,
        academy : academyId
    })

    if (deletedClass.deletedCount === 0) {
        return res.status(404).json({
                message: "Class not found."
        });
    }

    return res.status(204).json({
        message : "Successfully Deleted."
    })


    } catch(err) {
        return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
    }

}


export  { createClass, getClasses, DeleteClass }