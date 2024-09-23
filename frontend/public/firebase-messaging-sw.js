// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging.js');


// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWuIE_zX81zV0inWOrsF836YcnJLfuAJs",
    authDomain: "task-managment-app-3407b.firebaseapp.com",
    projectId: "task-managment-app-3407b",
    storageBucket: "task-managment-app-3407b.appspot.com",
    messagingSenderId: "1022493328424",
    appId: "1:1022493328424:web:0c004db28b69fcf337e11d"
  };

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize your notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // Change to your notification icon path
  };

  // Display the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
