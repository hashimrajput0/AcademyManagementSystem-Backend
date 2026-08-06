import express from "express"
import ConnectDB from "./db/db.js"
import { configDotenv } from "dotenv"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"

import cookieParser from "cookie-parser"
const app = express()

ConnectDB()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes )

export default app