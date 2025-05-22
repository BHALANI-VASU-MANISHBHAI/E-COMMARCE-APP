import jwt from "jsonwebtoken";


const adminAuth = (req, res, next) => {

try{
     const {token} = req.headers;
     console.log(token);
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
        let value  = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        // console.log(value);
        if(decoded.id!=(process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)){
            return res.status(401).json({success:false,message:"Unauthorized"});
        }

        next();
}catch(err){
    console.log(err);
    return res.status(500).json({success:false,message:err.message});   
}
}

export default adminAuth;