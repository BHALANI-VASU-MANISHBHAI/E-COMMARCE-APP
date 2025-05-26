    import {v2 as cloudinary} from 'cloudinary';
    import productModel from '../models/productModel.js';

    


    //function for adding a product
    const addProduct = async (req, res) => {
        try{
            const {name, price, description, category,subCategory, sizes , bestSeller} = req.body; 
        
            const image1 =  req.files.image1  && req.files.image1[0];
            const image2 =  req.files.image2  && req.files.image2[0];
            const image3 =  req.files.image3 && req.files.image3[0];
            const image4 =  req.files.image4 && req.files.image4[0];
            console.log({image1, image2, image3, image4});   
            const images = [image1, image2, image3, image4].filter((image) => image !== undefined);
            // Upload images to Cloudinary
            const imageUrls = await Promise.all(
                // Upload each image to Cloudinary
                images.map(async (image) => {
                    // resorce_type is used to specify the type of resource being uploaded
                    //image.path is the path of the image file on the server
                    const result = await cloudinary.uploader.upload(image.path, {resorce_type:'image'});
                    // result.secure_url is the URL of the uploaded image on Cloudinary
                    console.log(result.secure_url);
                    return result.secure_url;
                })
            );

            const productData = {
                name,
                price,
                description,
                category,
                subCategory,
                sizes :JSON.parse(sizes),
                // JSON.parse(sizes) is used to convert the string representation of an array into an actual array
                bestSeller : bestSeller === "true" ? true : false,
                image: imageUrls,
                date: Date.now()

            }

            console.log(productData);

            const product = await productModel.create(productData);

            await  product.save();
           

            res.status(200).json({ success:true,message: "Product added successfully"});
        }catch(err){
            console.log(err);
            res.status(500).json({ success:false, message: "Internal server error"});
        }
    }



    //function for list of products

    const listProducts = async (req, res) => {
        try{
            const products = await  productModel.find({});
            res.json({ success:true, products });
        }catch(err){
            console.log(err);
            res.status(500).json({ success:false, message: err.message });
        }
    }



    //function for removing a product

    const removeProduct = async (req, res) => {
        try{
            await productModel.findByIdAndDelete(req.body.id);
            res.json({success:true, message: "Product removed successfully"});
        }catch(err){
            console.log(err);
            res.status(500).json({ success:false, message: err.message });
        }
    }


    //function for  single product info

    const singleProduct = async (req, res) => {

        try{
            const {productId} = req.body;
            const product = await productModel.findById(productId);
            if(!product){
                return res.status(404).json({ success:false, message: "Product not found"});
            }

            res.status(200).json({ success:true, product });
        }catch(err){
            console.log(err);
            res.status(500).json({ success:false, message: err.message });
        }
    }



    export {
        addProduct,
        listProducts,
        removeProduct,
        singleProduct
    }