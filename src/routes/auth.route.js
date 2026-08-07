import express from "express"
import { RegisterController, RegisterUserAcademy, getMe,login ,refreshToken, logout, logoutAll, logoutAcademy } from "../controllers/auth.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
const router = express.Router()


router.post("/register-user",authMiddleware , RegisterController)
router.post("/register-academy" ,RegisterUserAcademy)
router.post("/refresh-token" ,refreshToken)
router.post("/login", login)
router.post("/logout",authMiddleware ,logout)
router.post("/logout-all", authMiddleware, logoutAll)
router.post("/logout-academy", authMiddleware, logoutAcademy)

router.get("/get-me", authMiddleware , getMe)



export default router