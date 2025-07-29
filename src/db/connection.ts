import {connect , disconnect} from "mongoose";

async function connectToDatabase(){
    try {
        await connect(process.env.MONGODB_URL);
    } catch (error) {
         throw new Error("Cannot connect to Database");
    }
}
async function DisconnectFromDatabase() {
    try {
       await disconnect();
    } catch (error) {
        throw new Error("Connat disconnect from database");
    }
    
}

export {connectToDatabase , DisconnectFromDatabase};