const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema ({
    userName: {
        type: String,
        default: "none",
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

var  User = mongoose.model('Users', UserSchema);

module.exports = User;