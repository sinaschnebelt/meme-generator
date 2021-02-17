var express = require('express');
var sizeOf = require('image-size');
const mongoose = require('mongoose');
var propmeme1 = sizeOf('./public/images/meme1.jpg');
var propmeme2 = sizeOf('./public/images/meme2.jpg');
var router = express.Router();


// Set up default mongoose connection
/**
* The backend application runs on port 3001 which is set in backend/bin/www.
* The frontend port runs per React App default on 3000 with a proxy to 3001 which is specified in the root package.json.
* By default MongoDB starts at port 27017 (could be changed in mongod.conf by adding net: port: <portOfChoice>)
* A port can be used only for one app or service at the same time.
*/
const mongoDB = 'mongodb://localhost:27017/memes';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define meme schema
const Schema = mongoose.Schema;

const memeSchema = new Schema({
  url: String,
  width: Number,
  height: Number,
  captionTop: String,
  captionBottom: String,
  ImageCaption: String,
});

//Compile model from schema
const Meme = mongoose.model('memes', memeSchema);


/* GET images listing. */
router.get('/', async (req, res, next) => {
    
   
    let data =  [
        {url: '/images/meme1.jpg',
        width: propmeme1.width,
        height: propmeme1.height},
        {
            url: '/images/meme2.jpg',
            width: propmeme2.width,
            height: propmeme2.height
        }
    ]
    res.json(data);
});


router.post('/', function(req, res, next) {
    // Formate data which was sent via POST in the above specified schema
    const savedMeme = new Meme({
        url: req.body.img.src,
        width: req.body.img.width,
        height: req.body.img.height,
        captionTop: req.body.captionTop,
        captionBottom: req.body.captionBottom,
        ImageCaption: req.body.ImageCaption,
    })

    // Adds the enlarged meme to the database when clicking on "Save meme" in the application.
    savedMeme.save()
        .then(() => {
            res.send() // this enables you to use console.log(response) on the client side
        }).catch(err => {
            res.status(400).send('Unable to save to database'); //if (err) return handleError(err);
        });
});




module.exports = router;