import { verifyToken } from "../utils/token.js";

export function authMiddleware(req,res,next){
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            error:{
                message:"Unauthorized!"
            }
        })
    }
    try{
        req.user = verifyToken(token)
        next()
    }catch(error){
        res.status(401).json({
            error:{
                message:"Invalid token"
            }
        })
    }
}