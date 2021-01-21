const mongoose  = require('mongoose')
const Schema = mongoose.Schema
const DbUser = new Schema({
    name :{
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    username : String,
    password: String,
    email: String,
    dateNow : {
        type: Date,
        default: Date.now
    },
    photo: String

})

module.exports = mongoose.model('shaxs' , DbUser)