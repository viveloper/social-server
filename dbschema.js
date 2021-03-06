const db = {
  users: [
    {
      userId: 'gafghffsvxcga',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2020-01-10T03:35:54.961Z',
      imageUrl: 'https://skakgkskdslf.com',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'http://user.com',
      location: 'London, UK'
    }
  ],
  screams: [
    {
      userHandle: 'user',
      body: 'this is a sample scream',
      createdAt: '2020-01-10T03:35:54.961Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: 'user',
      screamId: 'alskjdfljasldkfjsla',
      body: 'nice on mate!',
      createdAt: '2020-01-10T03:35:54.961Z'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: true,
      screamId: 'aglksjdlfjslakdf',
      type: 'like | comment',
      createdAt: '2020-01-10T03:35:54.961Z'
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: 'NKDJLKSDJLFJKLSJDKLFJ',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2020-01-10T03:35:54.961Z',
    imageUrl: 'image/alsjdlfjlsdf',
    bio: 'hello, my name is user',
    website: 'user.com',
    location: 'London, UK'
  },
  likes: [
    {
      userHandle: 'user',
      screamId: 'hhejflslfkllglaslkdflafs'
    },
    {
      userHandle: 'user',
      screamId: 'gsgsbdlsdfljlkxjljlksjelk'
    }
  ]
};
