const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(value);
      },
      message: "Vui lòng nhập địa chỉ email hợp lệ",
    },
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => /^0\d{9}$/.test(value),
      message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0",
    },
  },

  image: {
    type: String,
    required: false,
    default: "",
  },

  address: {
    type: String,
    default: "",
    trim: true,
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.length >= 8,
      message: "Mật khẩu phải có ít nhất 8 ký tự",
    },
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
