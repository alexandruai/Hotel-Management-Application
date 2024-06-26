const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : {type: String , require},
    email : {type: String , require},
    password : {type: String , require},
    isAdmin : {type: Boolean , require , default: false},
    type : {type: String , required: true , enum: ["client", "administrator", "manager", "angajat", "receptioner"]},
    hasAccess: { type: Boolean, default: false }
} , {
    timestamps : true,
})

module.exports = mongoose.model('users' , userSchema)