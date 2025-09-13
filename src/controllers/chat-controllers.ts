import { NextFunction, Request, Response } from "express";
import User from "../modals/user.js";
import { configureOpenAI } from "../config/groq-config.js";
import { Groq } from "groq-sdk";

type ChatMessage = {
  role: string;
  content: string;
};
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "user not register OR Token malfunctioned" });
    //grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    //send all chats with new one to Groq API
    const groq = configureOpenAI();

    //get latest response
    const chatResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: chats.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      })),
    });
    console.log("Groq API Response:", chatResponse);
    user.chats.push(chatResponse.choices[0].message);
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error(
      "Groq API Error:",
      error.response ? error.response.data : error.message
    );
    // console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const sendChatToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get all users
  try {
    const userExisted = await User.findById(res.locals.jwtData.id);
    if (!userExisted) {
      return res.status(401).send("Email or Password is incorrect");
    }
    if (userExisted._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("permission didn't match");
    }

    return res.status(200).json({ message: "ok ", chats: userExisted.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "server error", cause: error.message });
  }
};


export const deleteChats = async (
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
      //@ts-ignore
      user.chats = [];
      await user.save();
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };