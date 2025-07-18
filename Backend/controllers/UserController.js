import User from "../models/User.js";
import bcrypt from 'bcrypt'
const adduser = async (req, res) => {
    try {
        const { username, email, password, address, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword, address, role });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getusers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const deleteuser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getuser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User fetched successfully', user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const updateuser = async (req, res) => {
    try{
        const userId = req.user._id;
        const { username, email, password, address} = req.body;

        const updatedata = {username, email, address};
        if (password&&password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedata.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedata, { new: true }).select('-password');
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }
    catch(error){
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export { getusers, adduser, deleteuser, getuser, updateuser }