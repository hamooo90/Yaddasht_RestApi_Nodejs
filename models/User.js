const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required:true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required:true,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
//////
    isValid: {
        type: Boolean,
        default: false
    },
    uniqueString: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User',userSchema);