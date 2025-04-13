const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    studentName: String,
    tutorName: String,
    date: String,
    time: String
});

module.exports = mongoose.model('Session', sessionSchema);

