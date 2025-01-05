const mongoose = require('mongoose')

const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongodb = ()=>{
    mongoose.connect(mongoURI)
    console.log("Connected to Mongooes")
}

module.exports = connectToMongodb