import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// Configuração do Firebase - SUBSTITUA PELOS SEUS DADOS
const firebaseConfig = {
  apiKey: "AIzaSyBN2wd0rWUi-PynD13XU1DiezkN3ndRj_c",
  authDomain: "albatroz-fifa-championsh-e03c2.firebaseapp.com",
  projectId: "albatroz-fifa-championsh-e03c2",
  storageBucket: "albatroz-fifa-championsh-e03c2.firebasestorage.app",
  messagingSenderId: "916196675175",
  appId: "1:916196675175:web:b0f89a8c29fb33d7634ec2",
  measurementId: "G-W1BNKDQB0Y"
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