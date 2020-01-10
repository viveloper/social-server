const functions = require('firebase-functions');
const express = require('express');
const app = express();
const authMiddleware = require('./util/authMiddleware');
const {getAllScreams, postOneScream, signup, login} = require('./handlers');

// routes
app.get('/screams', getAllScreams);
app.post('/scream', authMiddleware, postOneScream);
app.post('/signup', signup);
app.post('/login', login);

// ============================================================
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// ============================================================
exports.api = functions.https.onRequest(app);