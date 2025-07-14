import bcrypt from 'bcrypt';
import User from './models/User.js'
import connectDB from './Config/db.js';

const register = async () => {
    try {
        connectDB();
        const hashPassword = await bcrypt.hash("admin1", 10);
        const newUser = new User({
            username: "admin1",
            email: "admin1@gmail.com" ,
            password: hashPassword,
            address: "admin address",
            role: "admin"
        })
        await newUser.save();
        console.log("Admin User created Successfullly");
    }
    catch (error) {
        console.error(error);
    }
}

register();