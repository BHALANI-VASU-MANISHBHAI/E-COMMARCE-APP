import jwt from 'jsonwebtoken';


const authUser= async (req, res, next) => {
   const token = req.headers.token;
   console.log("Token in authUser middleware:", token);
   
   if(!token){
        return res.json({success: false, message: 'Not Authorized Login Again'});
   }


   try{
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next(); 
   }catch(err){
    console.log(err);
    return res.json({success: false, message:err.message});
   }

}

export default authUser;