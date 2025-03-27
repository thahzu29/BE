const jwt = require('jsonwebtoken');

const authVendor = (req, res, next) => {
  try {
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).json({ msg: "Không có token. Truy cập bị từ chối." });
    }

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      return res.status(401).json({ msg: "Token không hợp lệ." });
    }

    req.vendorId = verified.id;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authVendor;
