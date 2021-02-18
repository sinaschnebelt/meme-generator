var express = require('express');
var Image = require('../models/image')
var router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');



const mongoDB = 'mongodb://localhost:27017/memes';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
       cb(null, Date.now() + file.originalname);
    }
 });


var upload = multer({ 
    storage: storage,
 })
  
//uploads single image to database
router.route("/upload")
    .post(upload.single('image'), (req, res, next) => {
        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: req.body.imageData
        });
        newImage.save()
            .then((result) => {
                //console.log(result);
                res.sendStatus(200);
            })
            .catch((err) => next(err));

    });

//TODO: delete database Entries, function currently throwing an error
router.delete('/', function(req, res, next) {
        db.dropCollection("memes", function (err, result) {

        if (err) {
            console.log(err);

        } else {
            console.log("delete collection success");
        }

    });
        res.send('Got a DELETE request for image');
});

//get single Meme by name
router.get("/singleMeme", async (req, res, next) => {
    var imageName = req.query.name;
    Image.findOne({'imageName': new RegExp(imageName, 'i')}, function (err, docs) { 
        if (err){ 
            console.log( 'This error is: '+ err); 
        } 
        else{ 
            console.log("Result : ", docs); 
            res.json(docs);
        } 

    })

});





module.exports = router;