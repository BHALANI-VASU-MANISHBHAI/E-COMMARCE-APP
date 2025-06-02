import jwt from 'jsonwebtoken';



const authUser= async (req, res, next) => {
   const token = req.headers.token;

      
   if(!token){
        return res.json({success: false, message: 'Not Authorized Login Again'});
   }

   try{
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", token_decode);
   //  req.body.userId = token_decode.id;
      req.userId = token_decode.id; // Store user ID in request object
      console.log("User ID set in request:", req.userId);
    next(); 

   }catch(err){
    console.log(err);
    return res.json({success: false, message:err.message});
   }

}

export default authUser;