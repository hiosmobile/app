import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, storage } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // Immediately attach the user's name to their new account
    await updateProfile(userCredential.user, {
      displayName: name,
    });
    return userCredential;
  }

  function logout() {
    return signOut(auth);
  }

  function changePassword(newPassword) {
    return updatePassword(auth.currentUser, newPassword);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function uploadProfilePicture(file) {
    if (!currentUser) return;

    // Create a folder path in storage: avatars/USER_ID
    const fileRef = ref(storage, `avatars/${currentUser.uid}`);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    // Update the Firebase profile
    await updateProfile(currentUser, { photoURL });

    // Update local state to immediately show the new picture
    setCurrentUser({ ...currentUser, photoURL });
    return photoURL;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    changePassword,
    resetPassword,
    uploadProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
