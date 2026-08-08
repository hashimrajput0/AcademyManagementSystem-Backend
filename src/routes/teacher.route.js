import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { createTeacher } from "../controllers/teacher.controller.js"
const router = express.Router()

router.post("/create", authMiddleware , createTeacher)




export default router