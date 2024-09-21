import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCWuIE_zX81zV0inWOrsF836YcnJLfuAJs",
  authDomain: "task-managment-app-3407b.firebaseapp.com",
  projectId: "task-managment-app-3407b",
  storageBucket: "task-managment-app-3407b.appspot.com",
  messagingSenderId: "1022493328424",
  appId: "1:1022493328424:web:0c004db28b69fcf337e11d"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: 'BJeGlaDKT3kzQ8CoJ9_WR3hjD-fR63mKitPBYngN5S13VipoPTM-X65xaXx1cjAODM3NMGik6a9NkenYa4dwX7c'
    });
     onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
     });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
};

async function requestNotificationPermission() {
  try {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
          displayBlockedMessage();
      } else if (permission === 'granted') {
          
          console.log('Notification permission granted.');
      }
  } catch (error) {
      console.error('Error requesting notification permission:', error);
  }
}

function displayBlockedMessage() {
  document.getElementById('notification-message').innerHTML = `
      Notifications are currently blocked in your browser. 
      To re-enable them, please follow these steps:
      <ul>
          <li>Go to your browser's settings.</li>
          <li>Find the "Privacy and Security" section.</li>
          <li>Click on "Site Settings" or "Notifications".</li>
          <li>Locate your website and enable notifications.</li>
      </ul>
  `;
}

