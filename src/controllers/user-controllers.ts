import { NextFunction, Request, Response } from "express";
import User from "../modals/user.js";
import { hash, compare  } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";


export const getAllUsers = async (
    req : Request,
    res: Response,
    next: NextFunction
) =>{
    //get all users
    try {
       const users = await User.find();
       return res.status(201).json({message: "ok" , users});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"server error"})
    
        
        
    }
    
}


export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user signup
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(401).send("User already registered");
      const hashedPassword = await hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
  
      // create token and store cookie
      // In production, don't set domain explicitly to allow the browser to use the current domain
      const clearCookieOptions = {
        path: "/",
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true
      };
      
      // Only set domain in development
      if (process.env.NODE_ENV !== "production") {
        clearCookieOptions['domain'] = "localhost";
      }
      
      res.clearCookie(COOKIE_NAME, {
        ...clearCookieOptions,
        sameSite: "none" as const
      });
      
      console.log("Cookie cleared with options:", clearCookieOptions);
  
      const token = createToken(user._id.toString(), user.email, "7d");
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      // In production, don't set domain explicitly to allow the browser to use the current domain
      const cookieOptions = {
        path: "/",
        expires,
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true
      };
      
      // Only set domain in development
      if (process.env.NODE_ENV !== "production") {
        cookieOptions['domain'] = "localhost";
      }
      
      res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        sameSite: "none" as const
      });
      
      console.log("Cookie set with options:", cookieOptions);
      
      // For debugging in production
      console.log("Cookie set with domain:", process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost");
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Cookie settings:", {
        path: "/",
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production"
      });
  
      return res
        .status(201)
        .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };


export const userLogin = async (
    req : Request,
    res: Response,
    next: NextFunction
) =>{
    //get all users
    try {

        const {email , password} = req.body;

        const userExisted = await User.findOne({email});
        if(!userExisted){
            return res.status(401).send('Email or Password is incorrect');
        } 
        const isPasswordCorrect = await compare(password, userExisted.password);
        if(!isPasswordCorrect){
            return res.status(403).send("incorrect password");
        }
        // In production, don't set domain explicitly to allow the browser to use the current domain
        const clearCookieOptions = {
          path: "/",
          httpOnly: true,
          signed: true,
          sameSite: "none",
          secure: true
        };
        
        // Only set domain in development
        if (process.env.NODE_ENV !== "production") {
          clearCookieOptions['domain'] = "localhost";
        }
        
        res.clearCookie(COOKIE_NAME, {
          ...clearCookieOptions,
          sameSite: "none" as const
        });
        
        console.log("Login - Cookie cleared with options:", clearCookieOptions);

        const token = createToken(userExisted._id.toString() , userExisted.email , "7d" );
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        
        // In production, don't set domain explicitly to allow the browser to use the current domain
        const cookieOptions = {
          path: "/",
          expires,
          httpOnly: true,
          signed: true,
          sameSite: "none",
          secure: true
        };
        
        // Only set domain in development
        if (process.env.NODE_ENV !== "production") {
          cookieOptions['domain'] = "localhost";
        }
        
        res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          sameSite: "none" as const
        });
        
        console.log("Login - Cookie set with options:", cookieOptions);
        
        // For debugging in production
        console.log("Login - Cookie set with domain:", process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost");
        console.log("Login - Environment:", process.env.NODE_ENV);
        console.log("Login - Cookie settings:", {
          path: "/",
          domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production"
        });
        return res.status(200).json({message: "ok login" , name: userExisted.name, email: userExisted.email});
        }
        
       
     catch (error) {
        console.log(error);
        return res.status(200).json({message:"server error"})
    
        
        
    }
    
}

export const verifyUser = async (
    req : Request,
    res: Response,
    next: NextFunction
) =>{
    //get all users
    try {
        const userExisted = await User.findById(res.locals.jwtData.id);
        if(!userExisted){
            return res.status(401).send('Email or Password is incorrect');
        } 
        if(userExisted._id.toString()!== res.locals.jwtData.id){
            return res.status(401).send("permission didn't match")
        }

        return res.status(200).json({message: "ok login" , name : userExisted.name, email: userExisted});
        }
        
       
     catch (error) {
        console.log(error);
        return res.status(200).json({message:"server error"})
    
        
        
    }
    
}

export const userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
  
      // In production, don't set domain explicitly to allow the browser to use the current domain
      const clearCookieOptions = {
        path: "/",
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true
      };
      
      // Only set domain in development
      if (process.env.NODE_ENV !== "production") {
        clearCookieOptions['domain'] = "localhost";
      }
      
      res.clearCookie(COOKIE_NAME, {
        ...clearCookieOptions,
        sameSite: "none" as const
      });
      
      console.log("Logout - Cookie cleared with options:", clearCookieOptions);
  
      return res
        .status(200)
        .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };