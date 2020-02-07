const functions = require('firebase-functions');
const express = require('express');
const app = express();
const authMiddleware = require('./util/authMiddleware');
const cors = require('cors');
app.use(cors());
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
  deleteScream,
  getUserDetails,
  markNotificationsRead
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
app.get('/user/:handle', getUserDetails);
app.post('/notifications', authMiddleware, markNotificationsRead);

// ============================================================
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// ============================================================
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
            .catch(err => console.log(err));
        }
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshot => {
    return db
      .collection('notifications')
      .doc(snapshot.id)
      .delete()

      .catch(err => console.log(err));
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
            .catch(err => console.log(err));
        }
      });
  });

exports.onUserImageChange = functions.firestore
  .document(`users/{userId}`)
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection('screams')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.collection('screams').doc(doc.id);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions.firestore
  .document(`screams/{screamId}`)
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.collection('comments').doc(doc.id));
        });
        return db
          .collection('likes')
          .where('screamId', '==', screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.collection('likes').doc(doc.id));
        });
        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.collection('notifications').doc(doc.id));
        });
        return batch.commit();
      })
      .catch(err => console.log(err));
  });
