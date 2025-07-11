import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ sucess: false, msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).json({ sucess: false, msg: "Invalid credentials." });
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            });

        return res.status(200).json(
            {
                sucess: true,
                msg: "Login Successfull", token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            });
    }
    catch (error) {
        return res.status(500).json({ sucess: false, message: 'Internal Server Error', error: error.message });
    }
}

export {login}