import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { createStudent, deleteStudent, getAllStudent, getClassStudent } from "../controllers/student.controller.js"
const router = express.Router()

router.post("/create", authMiddleware , createStudent)
router.delete("/delete", authMiddleware , deleteStudent)
router.get("/get-all", authMiddleware , getAllStudent)
router.get("/get-class-students", authMiddleware, getClassStudent )







export default router