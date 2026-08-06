import mongoose from "mongoose";
import 'dotenv/config'

async function ConnectDB() {

try {
    if(!process.env.DB_URI) {
        throw new Error("DB_URI is missing in .env");
    }

    await mongoose.connect(process.env.DB_URI)
    console.log("DB Connnected");
    


} catch(err) {
    console.error("Database Connection Error:", err);    
}
}


export default ConnectDB