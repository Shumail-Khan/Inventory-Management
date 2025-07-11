import mongoose from 'mongoose'


let UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ["admin", "customer"], default: "customer" }
})

const User = mongoose.model("User", UserSchema);
export default User