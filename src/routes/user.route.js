import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { toggleActive, deleteUser, getallAdmin } from "../controllers/user.controller.js"
const router = express.Router()



router.post("/toggle-active", authMiddleware ,toggleActive)
router.delete("/delete-user", authMiddleware,  deleteUser)
router.get("/get-all-admin", authMiddleware, getallAdmin)


export default router