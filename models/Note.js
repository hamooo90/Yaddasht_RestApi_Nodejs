const mongoose = require('mongoose');


const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },

    content: {
        type: String,
        required: false
    },

    timeAddEdit: {
        type: Number,
        default: Date.now
    },

    timeReminder: {
        type: Number
    },
    
    color: {
        type: Number
    },

    roomId: {
        type: Number,
        required: false
    },

    isSynced: {
        type: Boolean,
        default: false
        // required: true
    },

    
    ver: {
        type: Number,
        default: 1
    },

    ///////////////
    isCheckList: {
        type: Boolean,
        default:false
    },
    checklistTick: {
        type: String,
        default: ''
    },

    pinned: {
        type: Boolean,
        default: false
        // required: true
    },

    creationTime:{
        type: Number,
        default: 0
    }
    /////////////////

});

const model = mongoose.model('Notes',NoteSchema);
module.exports = {
    model: model,
    schema: NoteSchema
};

// module.exports = mongoose.model('Notes',NoteSchema);
// module.exports.NoteSchema = NoteSchema;