const functions = require('firebase-functions');
const express = require('express');
const app = express();
const authMiddleware = require('./util/authMiddleware');
const {
  getAllScreams,
  postOneScream,
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require('./handlers');

// scream routes
app.get('/screams', getAllScreams);
app.post('/scream', authMiddleware, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', authMiddleware, deleteScream);
app.get('/scream/:screamId/like', authMiddleware, likeScream);
app.get('/scream/:screamId/unlike', authMiddleware, unlikeScream);
app.post('/scream/:screamId/comment', authMiddleware, commentOnScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', authMiddleware, uploadImage);
app.post('/user', authMiddleware, addUserDetails);
app.get('/user', authMiddleware, getAuthenticatedUser);

// ============================================================
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// ============================================================
exports.api = functions.https.onRequest(app);
