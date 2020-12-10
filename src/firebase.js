import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"
import { functions } from "firebase";

var firebaseConfig = {
apiKey: "AIzaSyAn3IuSe16jKy1g7-BDJ3SsEty8wEt_1zM",
authDomain: "yuppie-2f2d0.firebaseapp.com",
databaseURL: "https://yuppie-2f2d0.firebaseio.com",
projectId: "yuppie-2f2d0",
storageBucket: "yuppie-2f2d0.appspot.com",
messagingSenderId: "348906973395",
appId: "1:348906973395:web:42a1128e31664f0a348c26",
measurementId: "G-R8W1FHYVKD"
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage()

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, companyName, fullName, phoneNumber} = user;
    try {
      await userRef.set({
        email,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

