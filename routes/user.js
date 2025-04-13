const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');
const Session = require('../models/Session');

// Home page
router.get('/', (req, res) => {
    res.render('index');
});

// Tutors list
router.get('/tutors', async (req, res) => {
    const tutors = await Tutor.find();
    res.render('tutors', { tutors });
});

// Single tutor detailed profile
router.get('/tutor/:id', async (req, res) => {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).send('Tutor not found');
    res.render('tutor-profile', { tutor });
});

// Book a session
router.get('/book', (req, res) => {
    res.render('book');
});

router.post('/book', async (req, res) => {
    const { studentName, tutorName, date, time } = req.body;
    const newSession = new Session({ studentName, tutorName, date, time });
    await newSession.save();
    res.redirect('/sessions');
});

// Sessions page
router.get('/sessions', async (req, res) => {
    const sessions = await Session.find();
    res.render('sessions', { sessions });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;
