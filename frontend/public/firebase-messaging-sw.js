importScripts('https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.6/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCWuIE_zX81zV0inWOrsF836YcnJLfuAJs",
  authDomain: "task-managment-app-3407b.firebaseapp.com",
  projectId: "task-managment-app-3407b",
  storageBucket: "task-managment-app-3407b.appspot.com",
  messagingSenderId: "1022493328424",
  appId: "1:1022493328424:web:0c004db28b69fcf337e11d"
};
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
