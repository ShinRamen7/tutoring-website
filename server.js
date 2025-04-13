const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const Session = require('./models/Session');
const Tutor = require('./models/Tutor');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session Setup
app.use(session({
    secret: 'yourSecretKey',  // Replace with a strong secret key later
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// ========== USER ROUTES ==========

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Book Session Page
app.get('/book', (req, res) => {
    res.render('book');
});

// Book Session Form Submission
app.post('/book', async (req, res) => {
    const { studentName, tutorName, date, time } = req.body;
    const newSession = new Session({ studentName, tutorName, date, time });
    await newSession.save();
    res.redirect('/sessions');
});

// Contact Page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Sessions Page (Show Booked Sessions)
app.get('/sessions', async (req, res) => {
    const sessions = await Session.find();
    res.render('sessions', { sessions });
});

// Tutors Page (Show all tutors)
app.get('/tutors', async (req, res) => {
    const tutors = await Tutor.find();
    res.render('tutors', { tutors });
});

app.get('/tutor/:id', async (req, res) => {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
        return res.status(404).send('Tutor not found');
    }
    res.render('tutor-profile', { tutor });
});

// ========== ADMIN AUTH ROUTES ==========

// Admin Login Page
app.get('/admin/login', (req, res) => {
    res.render('login');
});

// Admin Login Submission
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid credentials. <a href="/admin/login">Try again</a>');
    }
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// ========== PROTECTED ADMIN ROUTES ==========

// Admin Dashboard (View All Tutors)
app.get('/admin/dashboard', async (req, res) => {
    if (req.session.loggedIn) {
        const tutors = await Tutor.find();
        res.render('admin-dashboard', { tutors });
    } else {
        res.redirect('/admin/login');
    }
});

// Add Tutor Form
app.get('/admin/add-tutor', (req, res) => {
    if (req.session.loggedIn) {
        res.render('add-tutor');
    } else {
        res.redirect('/admin/login');
    }
});

// Handle Add Tutor Form Submission
app.post('/admin/add-tutor', async (req, res) => {
    if (req.session.loggedIn) {
        const { name, university, bio, photoUrl } = req.body;
        const newTutor = new Tutor({ name, university, bio, photoUrl });
        await newTutor.save();
        res.redirect('/admin/dashboard');   // ✅ After adding, go back to dashboard
    } else {
        res.redirect('/admin/login');
    }
});

// Edit Tutor Form
app.get('/admin/edit-tutor/:id', async (req, res) => {
    if (req.session.loggedIn) {
        const tutor = await Tutor.findById(req.params.id);
        res.render('edit-tutor', { tutor });
    } else {
        res.redirect('/admin/login');
    }
});

// Handle Edit Tutor Submission
app.post('/admin/edit-tutor/:id', async (req, res) => {
    if (req.session.loggedIn) {
        const { name, university, bio, photoUrl } = req.body;
        await Tutor.findByIdAndUpdate(req.params.id, { name, university, bio, photoUrl });
        res.redirect('/admin/dashboard');   // ✅ After editing, go back to dashboard
    } else {
        res.redirect('/admin/login');
    }
});

// Delete Tutor
app.post('/admin/delete-tutor/:id', async (req, res) => {
    if (req.session.loggedIn) {
        await Tutor.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');   // ✅ After deleting, go back to dashboard
    } else {
        res.redirect('/admin/login');
    }
});

// ========== SERVER LISTEN ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
