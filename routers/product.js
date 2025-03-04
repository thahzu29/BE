const express = require('express');
const Product = require('../models/product');


const productRouter = express.Router();

// API thêm sản phẩm mới
productRouter.post('/api/add-products', async (req, res) => {
    try {
        const { productName, productPrice, quantity, description, category, subCategory, images } = req.body;

        // Kiểm tra nếu thiếu dữ liệu quan trọng
        if (!productName || !productPrice || !quantity || !category || !subCategory || !images) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin sản phẩm!" });
        }

        const product = new Product({ productName, productPrice, quantity, description, category, subCategory, images });
        await product.save();
        
        return res.status(201).json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRouter.get('/api/popular-products',async(req, res)=>{
    try{
      const product =  await Product.find({popular: true});
      if(!product || product.length === 0){ 

        return res.status(404).json({msg:"product not found"});
      }else{
        return res.status(200).json({product});
      }
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

productRouter.get('/api/recommended-products',async(req, res)=>{
    try{
      const product =  await Product.find({recommend: true});
      if(!product || product.length === 0){ 
        return res.status(404).json({msg:"product not found"});
      }else{
        return res.status(200).json({product});
      }
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

module.exports = productRouter;