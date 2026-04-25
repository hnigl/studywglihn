import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Thông tin này bạn lấy từ Firebase Console (chỗ đã hướng dẫn ở câu trước)
const firebaseConfig = {
  apiKey: "AIzaSyCU8sP1xJek47Sj8qxLfItt6q90YJWWOxU",
  authDomain: "glinhprojectso1.firebaseapp.com",
  projectId: "glinhprojectso1",
  storageBucket: "glinhprojectso1.firebasestorage.app",
  messagingSenderId: "625747951187",
  appId: "1:625747951187:web:b8d1b3e53f8bb9b47350a6"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore (để dùng cho database)
export const db = getFirestore(app);

// Khởi tạo Firebase Authentication
export const auth = getAuth(app);