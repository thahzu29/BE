const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');

const orderRouter = express.Router();

// Tạo đơn hàng mới
orderRouter.post('/api/orders', async (req, res) => {
  try{
    const {
      fullName,email,address,phone,productName,productPrice,quantity,category,image,vendorId,buyerId,
    } = req.body;
    const createdAt = Date.now();
    const order = new Order({
      fullName, email, address, phone,
      productName, productPrice, quantity,
      category, image, vendorId, buyerId,
      createdAt
    });
    
    await order.save();
    return res.status(201).json(order);
  }catch(e){
      res.status(500).json({error:e.message});
  }
});

module.exports = orderRouter;
  