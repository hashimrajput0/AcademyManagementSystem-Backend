import { sessionModel } from "../models/session.model.js"
import { userModel } from "../models/user.model.js"


async function toggleActive(req, res) {

try {


    if(req.role !== "Principal") {
        return res.status(403).json({
            message : "Only Principal can perform this action."
        })
    }

    const { userID } = req.body
    const userAcademyID = req.academyId

    const user = await userModel.findOne({
       _id : userID, 
       academyId : userAcademyID
    })

    if (!user) {
    return res.status(404).json({
        message: "User not found"
    })
    }

if (user._id.toString() === req.user.toString()) {
    return res.status(400).json({
        message: "You cannot deactivate your own account"
    })
}


    const newIsActive = !(user.isActive) 
    user.isActive = newIsActive
    await user.save()

    return res.status(200).json({
        message : "Successfully Changed",
        userID : user._id,
        username : user.username,
        isActive : user.isActive
    })
 
} catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
}

}

async function deleteUser(req, res) {

try {

if(req.role !== "Principal") {
        return res.status(403).json({
            message : "Only Principal can perform this action."
        })
    }

    const { userID } = req.body
    const userAcademyID = req.academyId

    const user = await userModel.findOne({
       _id : userID, 
       academyId : userAcademyID
    })

    if (!user) {
    return res.status(404).json({
        message: "User not found"
    })
    }

    if (user.role === "Principal") {
    return res.status(403).json({
        message: "Principal cannot be deleted."
    })
    }

    await sessionModel.deleteMany({
    user: user._id
    })

    await user.deleteOne()

    return res.status(200).json({
        message: "User deleted successfully"
    })

} catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
}


}


async function getallAdmin(req, res) {

try {

    const academyId = req.academyId 

    if(req.role !== "Principal") {
        return res.status(403).json({
            message : "Only Principal can perform this action."
        })
    }

    const admins = await userModel.find({
            academyId: academyId,
            role: "Admin"
    })

    if(admins.length === 0) {
        return res.status(404).json({
            message : "Admin does not exist"
        })
    }

    return res.status(200).json({
        message : "Successfully Fetched",
        admins 
    })

    } catch(err) {
    return res.status(500).json({
        message : "Internal Server Error",
        error : err.message
    })
}

}

export { toggleActive, deleteUser, getallAdmin }