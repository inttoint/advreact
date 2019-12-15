import firebase from 'firebase';

export const appName = 'advreact';

export const firebaseConfig = {
  apiKey: "AIzaSyC6ZMZTMoh2vpFUgAn4XQxgDddRJQgeid4",
  authDomain: `${appName}-83584.firebaseapp.com`,
  databaseURL: `https://${appName}-83584.firebaseio.com`,
  projectId: `${appName}-83584`,
  storageBucket: `${appName}-83584.appspot.com`,
  messagingSenderId: "764034688248",
  appId: "1:764034688248:web:aeb597448b9824fd51070d",
  measurementId: "G-S9SXCG4S18"
};

firebase.initializeApp(firebaseConfig);