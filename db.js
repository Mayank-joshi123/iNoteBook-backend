const mongoose = require('mongoose')

const mongoURI = process.env.MONGO_URI

const connectToMongodb = ()=>{
    mongoose.connect(mongoURI)
    console.log("Connected to Mongooes")
}

module.exports = connectToMongodb