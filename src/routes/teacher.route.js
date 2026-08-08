import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { createTeacher, deleteTeacher, getAllTeacher } from "../controllers/teacher.controller.js"
const router = express.Router()

router.post("/create", authMiddleware , createTeacher)
router.delete("/delete", authMiddleware, deleteTeacher)
router.get("/get-all", authMiddleware, getAllTeacher)




export default router