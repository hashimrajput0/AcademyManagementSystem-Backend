import { studentModel } from "../models/student.model.js"


async function createStudent(req, res) {

    try {

        const academyId = req.academyId

        const { name, fatherName, classId, roll, phone, gender, status, admissionDate  } = req.body

        if(!name || !fatherName || !classId || !gender) {
            return res.status(400).json({
                message : "Please enter name, fathename, class, gender"
            })
        }

        const student = await studentModel.create({
            name, fatherName, classId, roll, phone, gender, status, admissionDate,
            academy : academyId
        })

        return res.status(201).json({
            message: "Student created successfully",
            student
        })

    } catch(err) {
        return res.status(500).json({
            message : "Internal Server Error",
            error : err.message
        })
    }


}

async function deleteStudent(req, res) {

    try {
        const academyId = req.academyId
        const {studentId} = req.body

        const userRole = req.role


        if(userRole !== "Principal") {
        return res.status(400).json({
            message : "Only Principal can delete Student"
        })
        }

        const student = await studentModel.deleteOne({
            _id : studentId,
            academy : academyId
        })

        
    if(student.deletedCount === 0) {
        return res.status(400).json({
            message : "Student not found"
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

async function getAllStudent(req, res) {

    try {

        const academyId = req.academyId;
        const { search } = req.query;

        const filter = {
            academy: academyId
        };

        if (search) {
            filter.name = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        const students = await studentModel.find(filter);

        return res.status(200).json({
            message: "Successfully fetched students",
            students
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

async function getClassStudent(req, res) {

try {

        const academyId = req.academyId;
        const { search, classId  } = req.query;

        const filter = {
            academy: academyId,
            classId : classId
        };

        if (search) {
            filter.name = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        const students = await studentModel.find(filter);

        return res.status(200).json({
            message: "Successfully fetched students",
            students
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}


export { createStudent, deleteStudent, getAllStudent, getClassStudent }