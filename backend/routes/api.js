var express = require('express');
var router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/memes';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});


//get single Meme by name
router.get("/:param1", async (req, res, next) => {
    console.log(req.params);
    res.json(req.params);
});


module.exports = router;