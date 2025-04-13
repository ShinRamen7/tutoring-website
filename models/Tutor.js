const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
    name: String,
    university: String,
    classYear: String,
    bio: String,
    longBio: String,
    resume: String,
    photoUrl: String,
    specialties: [String],
    acceptedSchools: [String]
});

module.exports = mongoose.model('Tutor', tutorSchema);
