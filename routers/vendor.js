const express = require('express');
const Vendor = require('../models/vendor');
const VendorRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Signup API
VendorRouter.post('/api/vendor/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingEmail = await Vendor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "Vendor with the same email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let vendor = new Vendor({ fullName, email, password: hashedPassword });
        vendor = await vendor.save();

        return res.json({ vendor });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Signin API
VendorRouter.post('/api/vendor/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await Vendor.findOne({ email });

        if (!findUser) {
            return res.status(400).json({ msg: "Không tìm thấy nhà cung cấp có email này" });
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Sai mật khẩu" });
        }

        const token = jwt.sign({ id: findUser._id }, "passwordKey");

        // Remove sensitive information
        const { password: _, ...vendorWithoutPassword } = findUser._doc;

        return res.json({
            token,
            vendor: {
                id: findUser._id,  
                fullName: findUser.fullName,
                email: findUser.email,
                state: findUser.state,
                city: findUser.city,
                locality: findUser.locality,
            }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = VendorRouter;