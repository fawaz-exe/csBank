import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const DB_CONNECT = process.env.MONGODB_COMPASS

async function connectDB(){
try {
    // const dbName = 'csBank'
    const URL = await mongoose.connect(DB_CONNECT)
    // console.log(URL);
    // console.log('MongoDB Connected 🌍');
} catch (error) {
    console.log(error);
}
}

connectDB()