import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDRJLTXxx9p1pNtvpd5puGnhK1QP6QOmWQ",
  authDomain: "barangay-id-system.firebaseapp.com",
  databaseURL: "https://barangay-id-system-default-rtdb.firebaseio.com",
  projectId: "barangay-id-system",
  storageBucket: "barangay-id-system.appspot.com",
  messagingSenderId: "20643190778",
  appId: "1:20643190778:web:921e257d422ac5ddbbf643",
  measurementId: "G-4SJN5T6Q1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app