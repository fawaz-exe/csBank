import mongoose from "mongoose";
import '../dbConnect.js'
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const DB_CONNECT = process.env.MONGODB_COMPASS
console.log("mongodb = ", DB_CONNECT);
const seedPassword = process.env.SEED_PASSWORD
// const dbName = 'csBank'

async function seedUser() {
    try {
        await mongoose.connect(DB_CONNECT)
        console.log('connected to MongoDB');

        const saltRounds = Number(process.env.SALTROUNDS)
        const hashedPassword = await bcrypt.hash(seedPassword, saltRounds)
        
        const user = new User({
            email: 'arma@google.com',
            password: hashedPassword,
        })

        await User.create(user)

        console.log('User Saved', user);

    } catch (error) {
        console.log("Seeding failed", error);
    }
}

seedUser()