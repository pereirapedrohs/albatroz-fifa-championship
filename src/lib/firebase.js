import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// Configuração do Firebase - SUBSTITUA PELOS SEUS DADOS
const firebaseConfig = {
  apiKey: "AIzaSyDgcocp2edfdOi9_St673fZNlNgP9VXlp8",
  authDomain: "albatroz-fifa-championship.firebaseapp.com",
  projectId: "albatroz-fifa-championship",
  storageBucket: "albatroz-fifa-championship.firebasestorage.app",
  messagingSenderId: "265788508154",
  appId: "1:265788508154:web:4101bb9c899a0e17228643",
  measurementId: "G-ECWT2HHRQB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar provedor do Google
const googleProvider = new GoogleAuthProvider();

// Funções de autenticação
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

// Funções do Firestore
export const createDocument = (collectionName, data) => 
  addDoc(collection(db, collectionName), data);

export const getDocument = (collectionName, docId) => 
  getDoc(doc(db, collectionName, docId));

export const updateDocument = (collectionName, docId, data) => 
  updateDoc(doc(db, collectionName, docId), data);

export const deleteDocument = (collectionName, docId) => 
  deleteDoc(doc(db, collectionName, docId));

export const getCollection = (collectionName, orderByField = null) => {
  const collectionRef = collection(db, collectionName);
  if (orderByField) {
    return getDocs(query(collectionRef, orderBy(orderByField)));
  }
  return getDocs(collectionRef);
};

export const setDocument = (collectionName, docId, data) => 
  setDoc(doc(db, collectionName, docId), data);

