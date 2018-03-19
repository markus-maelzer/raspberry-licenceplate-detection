const admin = require('firebase-admin');
const path = require('path');
// const Storage = require('@google-cloud/storage');

const serviceAccount = require("./firebase-admin-sdk.json");
// licence-plate-detection-firebase-adminsdk-4mgb7-9c16178113

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://licence-plate-detection.firebaseio.com",
  storageBucket: "licence-plate-detection.appspot.com"
});

// Storage
const bucket = admin.storage().bucket();
// DB
const db = admin.database();
const dbReferences = {
  plate: db.ref('plate'),
  error: db.ref('logs').child('error'),
  success: db.ref('logs').child('success'),
  settings: db.ref('settings'),
};

module.exports = {
  bucket,
  db: dbReferences,
}

// bucket.upload(filePath, {
//   destination: 'error-images/image-1234.jpg',
//   public: true,
//   metadata: { contentType: 'image/jpg' }
// }).then((data) => {
//   console.log(`${JSON.stringify(data, undefined, 2)}`);
// }).catch(e => {console.log(e);});

// DB things
// const plate = db.ref('plate');
// const ref = db.ref('logs');
// const sRef = ref.child('success');
// const eRef = ref.child('error');


// eRef.push().set(errorData);
// sRef.push().set(successData);

// plate.set({
//   plate: "GMS898"
// })
