// Import the express module
const express = require('express');
const mongoose = require('mongoose'); 
const authRouter = require('./routers/auth');
const bannerRouter = require('./routers/banner');
const categoryRouter = require('./routers/category');
const subcategoryRouter = require('./routers/sub_category');
const productRouter = require('./routers/product');
const productReviewRouter = require('./routers/product_review');
const cors = require('cors');
// Define the port number the server will listen on
const PORT = 3000;

// Create an instance of an express application
const app = express();
// mongodb string
const DB = "mongodb+srv://dduucc2912:Thanhvu_69@cluster0.gumbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);


mongoose.connect(DB).then(() =>{
    console.log('Mongodb Connected');
});

// Start the server and listen on the specified port
app.listen(PORT, "0.0.0.0", function(){
    // Log the port number
    console.log(`Server is running on port ${PORT}`);
});
