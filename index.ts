import app from "./app.js";
import {connectToDatabase} from "./src/db/connection.js";

const PORT = process.env.PORT || 3000;
connectToDatabase()
.then(()=>{
  app.listen(PORT, ()=>console.log("server is running on port 5000 and connected to Database."))
})
.catch((err)=>console.log(err))