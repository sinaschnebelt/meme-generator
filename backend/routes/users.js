var express = require('express');
var router = express.Router();
var User = require('../models/user')
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/users';
mongoose.createConnection(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.json([{
        id: 1,
        username: "samsepi0l"
    }, {
        id: 2,
        username: "D0loresH4ze"
    }]);
});

router.get('/allusers', (req, res) => {
    User.find({}).then(users => {
        res.json(users)
    })
})

//stores user information to database
router.post('/createUser', (req, res, next) => {

        const newUser = new User({
            userName: req.body.userName,
            userPassword: req.body.userPassword
        });
        newUser.save()
            .then((result) => {
                res.sendStatus(200);
            })
            .catch((err) => {
                    res.status(400).send('Unable to save to database')
                    //console.log(err)
           });

    });

//TODO: delete database Entries, function currently throwing an error
router.delete('/', function(req, res, next) {
    db.dropCollection("users", function (err, result) {

        if (err) {
            console.log(err);

        } else {
            console.log("delete collection success");
        }
    });
    res.send('Got a DELETE request for users');
});

module.exports = router;
