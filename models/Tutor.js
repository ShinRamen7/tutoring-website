const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
    name: String,
    university: String,      // Main university
    classYear: String,       // e.g., '2025'
    bio: String,             // Short intro
    longBio: String,         // Detailed description
    photoUrl: String,        // Profile pic
    specialties: [String],   // Subjects they tutor
    acceptedSchools: [String] // Schools they were accepted into
});

module.exports = mongoose.model('Tutor', tutorSchema);

