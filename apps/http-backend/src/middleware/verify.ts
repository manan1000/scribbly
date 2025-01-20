// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();
// export const verifyToken = (req,res,next) => {
//     const token = req.cookies.token;
//     try {
        
//         if(!token) return res.status(401).json({success:false,message:"Unauthenticated"});

//         const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decodedValue) return res.status(401).json({success:false,message:"Unauthenticated"});

//         req.userId=decodedValue.userId;
//         next();

//     } catch (error) {
//         console.error("Verify Token Error: ",error);
//         return res.status(401).json({success:false,message:"Unauthenticated"});
//     }
// }