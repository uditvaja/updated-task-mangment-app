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
    const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
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
