import '../styles/globals.css'
import '../styles/article.scss';
import type { AppProps } from 'next/app'
import { initializeApp } from "firebase/app"


function MyApp({ Component, pageProps }: AppProps) {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "metawall.firebaseapp.com",
    databaseURL: "https://metawall-default-rtdb.firebaseio.com",
    projectId: "metawall",
    storageBucket: "metawall.appspot.com",
    messagingSenderId: "726458653556",
    appId: "1:726458653556:web:625dde4387a7a27b5aaa21",
    measurementId: "G-F5TE4VKEKP"
  }

  try {
    initializeApp(firebaseConfig);
  } catch(err){
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack)}
  }

  return <Component {...pageProps} />
}
export default MyApp
