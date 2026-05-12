import jwt from 'jsonwebtoken'


export function signToken (data){
    return jwt.sign({id:data._id , email : data.email}, process.env.JWT_SECRET,{expiresIn:'7d'})
}

export function verifyToken(token){
    return jwt.verify(token,process.env.JWT_SECRET)
}