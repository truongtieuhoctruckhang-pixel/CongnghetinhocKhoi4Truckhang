import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCS1yi8iOWa3Pzg_WMRIhgrpqh0IJ34U20",
  authDomain: "congnghetinhock4truckhang.firebaseapp.com",
  projectId: "congnghetinhock4truckhang",
  storageBucket: "congnghetinhock4truckhang.firebasestorage.app",
  messagingSenderId: "432731339396",
  appId: "1:432731339396:web:714941850dc4715249a0d1",
  measurementId: "G-0W26BBFGFJ"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
