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

export { createTeacher }