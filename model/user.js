const mongoose = require('mongoose')

const userScheme = new mongoose.Schema({
    name:String,
    email:String,
    password: String,
    address:String,
    isActive:Boolean
})

const User = mongoose.model('newuser', userScheme)

module.exports = User