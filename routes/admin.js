const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');

// Admin login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid credentials. <a href="/admin/login">Try again</a>');
    }
});

// Admin logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Dashboard
router.get('/dashboard', async (req, res) => {
    if (req.session.loggedIn) {
        const tutors = await Tutor.find();
        res.render('admin/dashboard', { tutors });
    } else {
        res.redirect('/admin/login');
    }
});

// Add tutor form
router.get('/add-tutor', (req, res) => {
    if (req.session.loggedIn) {
        res.render('admin/add-tutor');
    } else {
        res.redirect('/admin/login');
    }
});

// Add tutor POST
router.post('/add-tutor', async (req, res) => {
    if (req.session.loggedIn) {
        const { name, university, classYear, bio, longBio, resume, photoUrl, specialties, acceptedSchools } = req.body;
        const newTutor = new Tutor({
            name,
            university,
            classYear,
            bio,
            longBio,
            resume,
            photoUrl,
            specialties: specialties.split(',').map(item => item.trim()),
            acceptedSchools: acceptedSchools.split(',').map(item => item.trim())
        });
        await newTutor.save();
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

// Edit tutor form
router.get('/edit-tutor/:id', async (req, res) => {
    if (req.session.loggedIn) {
        const tutor = await Tutor.findById(req.params.id);
        res.render('admin/edit-tutor', { tutor });
    } else {
        res.redirect('/admin/login');
    }
});

// Edit tutor POST
router.post('/edit-tutor/:id', async (req, res) => {
    if (req.session.loggedIn) {
        const { name, university, classYear, bio, longBio, resume, photoUrl, specialties, acceptedSchools } = req.body;
        await Tutor.findByIdAndUpdate(req.params.id, {
            name,
            university,
            classYear,
            bio,
            longBio,
            resume,
            photoUrl,
            specialties: specialties.split(',').map(item => item.trim()),
            acceptedSchools: acceptedSchools.split(',').map(item => item.trim())
        });
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

// Delete tutor
router.post('/delete-tutor/:id', async (req, res) => {
    if (req.session.loggedIn) {
        await Tutor.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

module.exports = router;
