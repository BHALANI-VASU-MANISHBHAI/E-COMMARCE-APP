    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import connectDB from './config/mongodb.js';
    import cloudinary from './config/cloudinary.js';
    import userRouter from './routes/userRoute.js';
    import productRouter from './routes/productRoute.js';


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
    // console.log('User Router:', userRouter);
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);

    app.get('/', (req, res) => {
    res.send('Hello World');
    });




    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
