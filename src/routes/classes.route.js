import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { createClass, getClasses } from "../controllers/classes.controller.js"
const router = express.Router()

router.post("/create", authMiddleware , createClass)
router.post("/get-all", authMiddleware , getClasses)



export default router