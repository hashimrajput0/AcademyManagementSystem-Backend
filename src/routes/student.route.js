import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { createStudent, deleteStudent } from "../controllers/student.controller.js"
const router = express.Router()

router.post("/create", authMiddleware , createStudent)
router.delete("/delete", authMiddleware , deleteStudent)






export default router