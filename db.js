const mongoose =  require('mongoose')
// const mongoURI = "mongodb://localhost:27017/notebook"
const mongoURI = "mongodb+srv://dhrubajyotighosh:dhrubajyotighosh@cluster0.etci0fh.mongodb.net/?retryWrites=true&w=majority"
const dotenv = require("dotenv");
dotenv.config();


const connectTOMongo = ()=>
{
    mongoose.connect(mongoURI,()=>{
        console.log("connet to mongo")
    })
}

module.exports = connectTOMongo