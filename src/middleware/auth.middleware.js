import jwt from "jsonwebtoken"
import { sessionModel } from "../models/session.model.js"

async function authMiddleware(req,res, next) {

    try {
        const authHeader = req.headers.authorization
        if(!authHeader) {
            return res.status(400).json({
                message : "AcessToken is Required"
            })
        }
        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        req.user = decoded.user
        req.academyId = decoded.academyId
        req.role = decoded.role
        
        
        const session = await sessionModel.findById(decoded.session)
if (!session) {
    return res.status(401).json({
        message: "Session not found"
    })
}

if (session.revoked) {
    return res.status(401).json({
        message: "Session has been revoked"
    })
}

if (!decoded.isActive) {
    return res.status(401).json({
        message : "Account is Deactivated"
    })
}
        
        console.log(decoded);
        
        next();

    } catch(err) {
        return res.status(401).json({
            message : "Internal Server Error",
            error : err.message
        })
    }

}

export default authMiddleware