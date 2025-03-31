const express = require('express');
const ProductReview = require('../models/product_review');
const Product = require('../models/product'); 
const productReviewRouter = express.Router();

// Tạo đánh giá sản phẩm
productReviewRouter.post('/api/product-review', async (req, res) => {
    try {
        const { buyerId, email, fullName, productId, rating, review } = req.body;

        // Kiểm tra nếu người dùng đã đánh giá sản phẩm này
        const existingReview = await ProductReview.findOne({ buyerId, productId });
        if (existingReview) {
            return res.status(400).json({ error: "Bạn đã đánh giá sản phẩm này trước đó." });
        }

        if (!buyerId || !email || !fullName || !productId || rating === undefined || !review) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin đánh giá." });
        }

        const parsedRating = Number(rating);

        if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
            return res.status(400).json({ error: "Đánh giá phải là số từ 0 đến 5." });
        }

        const reviews = new ProductReview({
            buyerId,
            email,
            fullName,
            productId,
            rating: parsedRating,
            review,
        });

        await reviews.save();

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        // ✅ Tăng số lượng đánh giá trước khi tính trung bình
        product.totalRatings += 1;
        
        // ✅ Cập nhật averageRating
        product.averageRating = ((product.averageRating * (product.totalRatings - 1)) + parsedRating) / product.totalRatings;

        await product.save();

        return res.status(201).send(reviews);
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }
});

// Lấy tất cả các đánh giá
productReviewRouter.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await ProductReview.find();
        return res.status(200).json(reviews);
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }
});

module.exports = productReviewRouter;
