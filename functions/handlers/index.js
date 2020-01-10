const firebase = require('../util/firebase');
const { db } = require('../util/firebaseAdmin');
const { validateSignupData, validateLoginData } = require('../util/validators');

exports.getAllScreams = (req, res) => {
  db.collection('screams').orderBy('createdAt', 'desc').get().then(data => {
    const screams = [];
    data.forEach(doc => {
      screams.push({
        screamId: doc.id,
        userHandle: doc.data().userHandle,
        body: doc.data().body,
        createdAt: doc.data().createdAt
      });
    });
    return res.json(screams);
  }).catch(err => console.error(err));
}

exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' })
  }

  const newScream = {
    userHandle: req.user.handle,
    body: req.body.body,
    createdAt: new Date().toISOString()
  };

  db.collection('screams').add(newScream).then(doc => {
    res.json({ message: `document ${doc.id} created successfully` });
  }).catch(err => {
    res.status(500).json({ error: 'something went wrong' });
    console.error(err);
  })
}

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  // == validate data
  const validationResult = validateSignupData(newUser)
  if (!validationResult.valid) return res.status(400).json(validationResult.errors);
  // ==

  db.collection('users').doc(newUser.handle).get().then(doc => {
    if (doc.exists) {
      return res.status(400).json({ handle: 'this handle is already taken' })
    }
    else {
      let userId = null;
      let token = null;
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
      }).then(idToken => {
        token = idToken;
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          userId
        }
        return db.collection('users').doc(newUser.handle).set(userCredentials);
      }).then(() => {
        return res.status(201).json({ token });
      }).catch(err => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'Email is already in use' })
        }
        else if (err.code === 'auth/weak-password') {
          return res.status(400).json({ password: 'weak password' })
        }
        else {
          return res.status(500).json({ error: err.code });
        }
      })
    }
  })
}

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  // == validation data
  const validationResult = validateLoginData(user)
  if (!validationResult.valid) return res.status(400).json(validationResult.errors);
  // ==

  firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(data => {
    return data.user.getIdToken();
  }).then(token => {
    return res.json({ token });
  }).catch(err => {
    console.error(err);
    if (err.code === 'auth/wrong-password') {
      return res.status(400).json({ password: 'wrong password' });
    }
    else if (err.code === 'auth/user-not-found') {
      return res.status(400).json({ email: 'user not found' });
    }
    else {
      return res.status(500).json({ error: err.code });
    }
  })
}