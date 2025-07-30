import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express"
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id : String, email : String, expiresIn) => {
    const payload = {id, email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction)=>{
    console.log('Cookies:', req.cookies);
    console.log('Signed Cookies:', req.signedCookies);
    console.log('Headers:', req.headers);
    
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if(!token || token.trim()== ""){
        return res.status(401).json({message:"No token provided."});
         
    }
    try {
        console.log('Attempting to verify token:', token);
        console.log('Using JWT_SECRET:', process.env.JWT_SECRET ? 'Secret is set' : 'Secret is NOT set');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        res.locals.jwtData = decoded;
        return next();
    } catch (error) {
        console.log('Token verification error:', error);
        return res.status(401).json({message:"Token expired or invalid."});
    }
    
}