const mongoose = require("mongoose");

const userAuthorSchema = new mongoose.Schema({
    role :{
        type:String,
        required:true,
    },
    firstName :{
        type:String,
        required:true,
    },
    lastName :{
        type:String,
        required:false,
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    profileImageUrl :{
        type:String,
    },
    isActive :{
        type:Boolean,
        default:true,
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
},{"strict":"throw"})

const UserAuthor = mongoose.model('userauthor',userAuthorSchema);

module.exports=UserAuthor;