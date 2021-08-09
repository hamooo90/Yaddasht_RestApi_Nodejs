const express = require('express');
const { set } = require('mongoose');
const router = express.Router();
const {model,schema} = require('../models/Note');
const verify = require('./verifyToken');
const mongoose = require('mongoose');

// token verify
router.get('/v/', verify, (req,res) => {
    res.send(req.user);
})

// get all the notes
router.get('/',verify, (req,res) => {
    const NoteUserModel = mongoose.model(req.user._id,schema);
    NoteUserModel.find()
        .then(result => {
            res.json(result);
            // console.log(result.date.getTime())
        })
        .catch(err => {
            console.log(err);
        });
});

// get single note by id
router.get('/:postId', verify, (req,res) => {
    const NoteUserModel = mongoose.model(req.user._id,schema);
    NoteUserModel.findById(req.params.postId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// submit a note
router.post('/', verify,(req,res) => {
    const NoteUserModel = mongoose.model(req.user._id,schema);
    const note = new NoteUserModel({
        title: req.body.title,
        content: req.body.content,
        timeAddEdit: req.body.timeAddEdit,
        timeReminder: req.body.timeReminder,
        color: req.body.color,
        roomId: req.body.roomId,
        isSynced: req.body.isSynced,

        ver: req.body.ver,
        ////////////////////////
        isCheckList: req.body.isCheckList,
        checklistTick: req.body.checklistTick,
        pinned: req.body.pinned,
        creationTime: req.body.creationTime
        ///////////////////////
    });
    note.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        })
});

// delete single note by id
router.delete('/:postId', verify, (req, res) => {
    const NoteUserModel = mongoose.model(req.user._id,schema);
    NoteUserModel.remove({_id: req.params.postId})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
    });
});

// update a note
router.patch('/:postId', verify, (req,res) => {
    const NoteUserModel = mongoose.model(req.user._id,schema);
    NoteUserModel.updateOne({_id: req.params.postId},
        { $set: {
            title: req.body.title,
            content: req.body.content,
            timeAddEdit: req.body.timeAddEdit,
            timeReminder: req.body.timeReminder,
            color: req.body.color,
            roomId: req.body.roomId,
            isSynced: req.body.isSynced,

            ver: req.body.ver,

            ///////////////////////////////
        isCheckList: req.body.isCheckList,
        checklistTick: req.body.checklistTick,
        pinned: req.body.pinned,
        creationTime: req.body.creationTime

        ///////////////////////
            }
        })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;