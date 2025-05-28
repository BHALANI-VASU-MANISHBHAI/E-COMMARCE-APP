import jwt from 'jsonwebtoken';


const authUser= async (req, res, next) => {
   const token = req.headers.token;
   console.log("Token in authUser middleware:", token);
   
   if(!token){
        return res.json({success: false, message: 'Not Authorized Login Again'});
   }

   try{
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", token_decode);
    req.body.userId = token_decode.id;
   console.log("User ID in request body:", req.body.userId);
   console.log("Before next() call");
    next(); 
    console.log("after next() call");
   }catch(err){
    console.log(err);
    return res.json({success: false, message:err.message});
   }

}

export default authUser;