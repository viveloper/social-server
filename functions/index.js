const functions = require('firebase-functions');
const express = require('express');
const app = express();
const authMiddleware = require('./util/authMiddleware');
const { db } = require('./util/firebaseAdmin');
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

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate(snapshot => {
    db.doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db
            .collection('notifications')
            .doc(snapshot.id)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type: 'like',
              read: false,
              screamId: doc.id
            })
            .then(() => {
              return;
            })
            .catch(err => {
              console.log(err);
              return;
            });
        }
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshot => {
    db.collection('notifications')
      .doc(snapshot.id)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshot => {
    db.doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db
            .collection('notifications')
            .doc(snapshot.id)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type: 'comment',
              read: false,
              screamId: doc.id
            })
            .then(() => {
              return;
            })
            .catch(err => {
              console.log(err);
              return;
            });
        }
      });
  });
