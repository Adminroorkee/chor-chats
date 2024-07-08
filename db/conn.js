const mongoose = require("mongoose");
 const password = process.env.password || "NZaMfua3IGRItUqm";

mongoose.connect(`mongodb+srv://chorchatadmin:${password}@cluster0.pfqjc7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(()=>console.log("db connected")).catch((err)=>console.log("db connection error",err))