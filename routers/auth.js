const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

// API đăng ký
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, phone, password, image } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "Email này đã được sử dụng" });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ msg: "Số điện thoại này đã được sử dụng" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            image: image || "", 
        });

        user = await user.save();

        return res.json({ user });
    } catch (e) {
        return res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau." });
    }
});

// API đăng nhập
authRouter.post('/api/signin', async (req, res) => {
    try {
        const { loginInput, password } = req.body;

        const findUser = await User.findOne({
            $or: [{ email: loginInput }, { phone: loginInput }]
        });

        if (!findUser) {
            return res.status(400).json({ msg: "Không tìm thấy người dùng với thông tin đã cung cấp" });
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Mật khẩu không đúng" });
        }

        const token = jwt.sign({ id: findUser._id }, "passwordKey");

        const { password: _, ...userWithoutPassword } = findUser._doc;

        return res.json({ token, user: userWithoutPassword });

    } catch (error) {
        return res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau." });
    }
});
// ✅ API cập nhật thông tin người dùng
authRouter.put('/api/user/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, phone, email, address, image } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          fullName,
          phone,
          email,
          address,
          image
        },
        { new: true } // Trả về bản ghi sau khi update
      );
  
      if (!updatedUser) {
        return res.status(404).json({ msg: "Không tìm thấy người dùng" });
      }
  
      const { password, ...userWithoutPassword } = updatedUser._doc;
  
      return res.json({
        msg: "Cập nhật thông tin thành công",
        user: userWithoutPassword,
      });
    } catch (error) {
      return res.status(500).json({ error: "Lỗi cập nhật thông tin: " + error.message });
    }
  });

  // fetch user by id
authRouter.get('/api/user', async (req, res) => {
    try {
      const users = await User.find().select('-password');
      return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: "Lỗi lấy thông tin người dùng: " + error.message });
    }
    });
   
  
module.exports = authRouter;
