import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { createClass, getClasses, DeleteClass } from "../controllers/classes.controller.js"
const router = express.Router()

router.post("/create", authMiddleware , createClass)
router.get("/get-all", authMiddleware , getClasses)
router.delete("/delete", authMiddleware, DeleteClass)



export default router