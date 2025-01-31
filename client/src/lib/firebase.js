import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBD_9VkwzeM7KFFxD5JYg3MH3EoD3NoejY",
  authDomain: "innovatu-c33d2.firebaseapp.com",
  projectId: "innovatu-c33d2",
  storageBucket: "innovatu-c33d2.firebasestorage.app",
  messagingSenderId: "132237324949",
  appId: "1:132237324949:web:ea18311dba19211151a19c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);