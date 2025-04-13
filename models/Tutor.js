const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
    name: String,
    university: String,
    bio: String,
    photoUrl: String // URL for their headshot
});

module.exports = mongoose.model('Tutor', tutorSchema);

