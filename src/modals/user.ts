import mongoose from "mongoose";
import { randomUUID } from "crypto";



const chatSchema = new mongoose.Schema({
    id: { 
        type: String, 
        default : randomUUID() 
    },
    role: {
        type : String,
        required : true
    },
    content: {
        type : String,
        required : true 
    }
});

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    email: {
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : true
    },
    chats : [chatSchema]
});

export default mongoose.model("User" , userSchema);