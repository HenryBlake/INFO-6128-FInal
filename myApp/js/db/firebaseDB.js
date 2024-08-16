import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


class CatDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            try {
                // Your web app's Firebase configuration
                const firebaseConfig = {
                    apiKey: "AIzaSyCA0pyxRhCJHTas6lUvydkB7L1kBJiDYQs",
                    authDomain: "info-6128-e3339.firebaseapp.com",
                    projectId: "info-6128-e3339",
                    storageBucket: "info-6128-e3339.appspot.com",
                    messagingSenderId: "236321873138",
                    appId: "1:236321873138:web:d07724b5701c7b3448c46b",
                    measurementId: "G-8F04ZSLQF6",
                  };

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);

                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);

                if (db) {
                    this.db = db;
                    this.isAvailable = true;
                    resolve();
                } else {
                    reject('The database is not available');
                }

            } catch (error) {
                reject('error.message');
            }
        }
        )
    };

    firebaseWrite(catobj) {
        dbRef.add(catobj);
    };

    firebaseDelete() { };

    firebaseReadOnce() {
        dbRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const catData = doc.data();
                appendListCats(catData);
                // console.log(doc.data())
            });
        });
    }

}

export default new CatDB();