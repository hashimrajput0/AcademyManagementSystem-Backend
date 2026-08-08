import express from "express"
import ConnectDB from "./db/db.js"
import { configDotenv } from "dotenv"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import classRoutes from "./routes/classes.route.js"
import teacherRoutes from "./routes/teacher.route.js"
import studentRoutes from "./routes/student.route.js"




import cookieParser from "cookie-parser"
const app = express()

ConnectDB()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes )
app.use("/api/class", classRoutes )
app.use("/api/teacher", teacherRoutes )
app.use("/api/student", studentRoutes )



export default app