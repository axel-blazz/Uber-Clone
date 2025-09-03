const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

console.log("Firebase Service Account:", serviceAccount);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
