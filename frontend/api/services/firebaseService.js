const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');  

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = (registrationToken, message) => {
  const payload = {
    notification: {
      title: message.title,
      body: message.body,
    },
    token: registrationToken,
  };

  admin.messaging().send(payload)
    .then(response => {
      console.log('Successfully sent notification:', response);
    })
    .catch(error => {
      console.log('Error sending notification:', error);
    });
};

module.exports = { sendNotification };
