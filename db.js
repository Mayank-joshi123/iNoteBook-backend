const mongoose = require('mongoose')

const mongoURI = process.env.MONGO_URI
console.log(mongoURI)
const connectToMongodb = ()=>{
    mongoose.connect(mongoURI)
    console.log("Connected to Mongooes")
}

module.exports = connectToMongodb