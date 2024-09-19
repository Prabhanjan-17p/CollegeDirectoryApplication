const mongoose = require("mongoose");
mongoose.connect('mongodb://0.0.0.0:27017/LoginRegisterJWT',{
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch(()=>{
    console.log("Failed to connect to MongoDB...");
});