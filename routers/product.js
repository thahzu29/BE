const express = require('express');
const Product = require('../models/product');


const productRouter = express.Router();

// API thêm sản phẩm mới
productRouter.post('/api/add-products', async (req, res) => {
    try {
        const { productName, productPrice, quantity, description, category,vendorId, fullName, subCategory, images } = req.body;

        // Kiểm tra nếu thiếu dữ liệu quan trọng
        if (!productName || !productPrice || !quantity || !category || !subCategory || !images) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin sản phẩm!" });
        }

        const product = new Product({ productName, productPrice, quantity, description, category,vendorId, fullName, subCategory, images });
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

        return res.status(404).json({msg:"không tìm thấy sản phẩm"});
      }else{
        return res.status(200).json(product);
      }
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

productRouter.get('/api/recommended-products',async(req, res)=>{
    try{
      const product =  await Product.find({recommend: true});
      if(!product || product.length === 0){ 
        return res.status(404).json({msg:"không tìm thấy sản phẩm"});
      }else{
        return res.status(200).json({product});
      }
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

productRouter.get('/api/products-by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    // Kiểm tra nếu category rỗng
    if (!category || category.trim() === "") {
      return res.status(400).json({ error: "Danh mục không hợp lệ!" });
    }

    // Truy vấn danh mục trong MongoDB (Không phân biệt chữ hoa/thường)
    const products = await Product.find({ category,popular:true });

    // Kiểm tra nếu không có sản phẩm nào trong danh mục
    if (!products || products.length === 0) {
      return res.status(404).json({ msg: `Không tìm thấy sản phẩm trong danh mục '${category}'` });
    }

    // Trả về danh sách sản phẩm
    return res.status(200).json(products);
  } catch (e) {
    console.error(`Lỗi khi truy vấn danh mục '${req.params.category}':`, e);
    return res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau!" });
  }
});


module.exports = productRouter;