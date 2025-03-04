const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

// Signup API
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "User with the same email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = new User({ fullName, email, password: hashedPassword });
        user = await user.save();

        return res.json({ user });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Signin API
authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(400).json({ msg: "User not found with this email" });
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect Password" });
        }

        const token = jwt.sign({ id: findUser._id }, "passwordKey");

        // Remove sensitive information
        const { password: _, ...userWithoutPassword } = findUser._doc;

        // Send the response
        return res.json({ token, ...userWithoutPassword });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = authRouter;
