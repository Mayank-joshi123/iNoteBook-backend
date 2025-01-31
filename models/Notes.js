const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
    },
    tag: {
        type: String,
        default: "Genral"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema)