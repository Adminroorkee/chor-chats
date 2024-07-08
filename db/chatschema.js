const mongoose = require("mongoose");

const chatschema = mongoose.Schema({
    items:{
    type:Array,
    default:[]
    }
})

const chatmodel = mongoose.model('Chatmodel',chatschema);

module.exports = chatmodel;