const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ImageSchema = new Schema ({
    imageName: {
        type: String,
        default: "none",
        required: true
    },
    imageData: {
        type: String,
        required: true
    },
});

var Image = mongoose.model('Memes', ImageSchema);

module.exports = Image;