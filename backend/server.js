        import express from 'express';
        import cors from 'cors';
        import dotenv from 'dotenv';
        import connectDB from './config/mongodb.js';
        import cloudinary from './config/cloudinary.js';
        import userRouter from './routes/userRoute.js';
        import productRouter from './routes/productRoute.js';
        import cartRouter from './routes/cartRoute.js';
        import orderRouter from './routes/orderRoute.js';
        import reviewRouter from './routes/reviewRoute.js';
        import razorpayInstance from './config/razorPay.js';
        import SubscriberRoute from './routes/subscriberRoute.js';


        //App Config
        dotenv.config();
        const app = express();
        const PORT = process.env.PORT || 4000;
        connectDB();
        cloudinary();
    

        //Middleware
        app.use(cors());
        app.use(express.json());


        //API endpoints
        app.use('/api/user', userRouter);
        app.use('/api/product', productRouter);
        app.use('/api/cart', cartRouter);
        app.use('/api/order', orderRouter);
        app.use('/api/review', reviewRouter);
        app.use('/api/subscriber', SubscriberRoute);
        

        app.get('/', (req, res) => {
        res.send('Hello World');
        });




        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        });
