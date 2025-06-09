import jwt from 'jsonwebtoken';



const authUser= async (req, res, next) => {
   
   try{
      const token = req.headers.token;  
      console.log("Token:", token);
   if(!token){
        return res.json({success: false, message: 'Not Authorized Login Again'});
   }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
   //  req.body.userId = token_decode.id;
      req.userId = token_decode.id; // Store user ID in request object
      console.log("Decoded Token:", token_decode);
    next(); 

   }catch(err){
    console.log(err);
    return res.json({success: false, message:err.message});
   }

}

export default authUser;