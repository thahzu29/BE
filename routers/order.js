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

// Nhận tuyến đường để lấy ID người mua đơn hàng
orderRouter.get('/api/orders/:buyerId',async(req,res)=>{
  try{
    const {buyerId} =req.params;
    const orders = await Order.find({buyerId});
    if(orders.length == 0){
      return res.status(404).json({msg:"Không có đơn đặt hàng"});
    }
    // đơn hàng có sẵn trả về trạng thái 200
    return res.status(200).json(orders);
  }catch(e){
      res.status(500).json({error:e.message});
  }
});

// xoa don hang
orderRouter.delete("/api/orders/:id",async(req, res)=>{

try{
  const {id} = req.params;
 const deleteOrder =  await Order.findByIdAndDelete(id);
  if(!deleteOrder){
    return res.status(400).json({msg:"Không tìm thấy đơn hàng"});
  }else{
    return res.status(200).json({msg:"Đơn hàng đã xóa"});
  }
}catch(e){
  return res.status(500).json({error:e.message});
}
});

// Nhận tuyến đường để lấy ID người bán hàng
orderRouter.get('/api/orders/vendors/:vendorId',async(req,res)=>{
  try{
    const {vendorId} =req.params;
    const orders = await Order.find({vendorId});
    if(orders.length == 0){
      return res.status(404).json({msg:"Không có đơn đặt hàng"});
    }
    // đơn hàng có sẵn trả về trạng thái 200
    return res.status(200).json(orders);
  }catch(e){
      res.status(500).json({error:e.message});
  }
});

orderRouter.patch('/api/orders/:id/delivered', async(req, res)=>{
  try{
    const {id} = req.params;
  const updatedOrder =  await Order.findByIdAndUpdate(
      id,
      {delivered:true,processing:false},
      {new:true} 
    );

    if(!updatedOrder){
      return res.status(404).json({msg:"không thấy đơn hàng"})
    }else{
      return res.status(200).json(updatedOrder);
    }
  }catch(e){
    res.status(500).json({error:e.message});

  }
});


orderRouter.patch('/api/orders/:id/processing', async(req, res)=>{
  try{
    const {id} = req.params;
  const updatedOrder =  await Order.findByIdAndUpdate(
      id,
      {processing:false, delivered:false},
      {new:true} 
    );

    if(!updatedOrder){
      return res.status(404).json({msg:"không thấy đơn hàng"})
    }else{
      return res.status(200).json(updatedOrder);
    }
  }catch(e){
    res.status(500).json({error:e.message});

  }
});

// Lấy tất cả đơn hàng
orderRouter.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}); 

module.exports = orderRouter;
  