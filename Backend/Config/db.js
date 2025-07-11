import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () =>{
    try{
        mongoose.connect(process.env.MONGO_URI, {
        }).then(() => {
            console.log('Connected to MongoDB');});
    }
    catch(error){
        console.error("Connection Failed", error.message);
        process.exit(1);
    }
}

export default connectDB;