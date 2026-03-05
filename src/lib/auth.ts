import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function getUser() {
  return new Promise<FirebaseUser | null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithUsername(
  email: string,
  password: string,
  username: string
) {
  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const uid = userCredential.user.uid;

  // Create user document in Firestore
  await setDoc(doc(db, 'users', uid), {
    id: uid,
    username,
    email,
    avatar_url: null,
    bio: '',
    created_at: new Date(),
  });

  return userCredential.user;
}

