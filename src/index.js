import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.FIREBASE_MSGSENDER_ID}`,
  appId: `${process.env.FIREBASE_APP_ID}`,
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const collRef = collection(db, "movies");
const queryRef = query(
  collRef,
  where("category", "==", "action"),
  orderBy("createdAt"),
);

// getDocs(collRef)
//     .then(data => {
//         let movies = [];
//
//         data.docs.forEach(d => {
//             movies.push({ ...d.data(), id: d.id });
//         });
//
//         document.write(JSON.stringify(movies, null, 4));
//         document.getElementById("app").innerHTML = `
//         <div>
//           <pre>
//             ${JSON.stringify(movies, null, 4)}
//           </pre>
//         </div>
//         `;
//         console.log(JSON.stringify(movies, null, 4));
//     })
//     .catch(error => {
//         console.log(error);
//     });

getDocs(queryRef)
  .then((data) => {
    let movies = [];
    data.docs.forEach((document) => {
      movies.push({ ...document.data(), id: document.id });
    });
    console.log(`Filtered Movies List: ${JSON.stringify(movies, null, 4)}`);
  })
  .catch((error) => {
    console.log(error);
  });

onSnapshot(collRef, (data) => {
  let movies = [];
  data.docs.forEach((document) => {
    movies.push({ ...document.data(), id: document.id });
  });
  console.log("-- All movie list --");
  console.log(movies);
  console.log("-- -- -- -- -- -- --");
});

// get reference to the add form
const addForm = document.querySelector(".add");
addForm.addEventListener("submit", (event) => {
  // Prevent the form's default behavior
  event.preventDefault();
  addDoc(collRef, {
    name: addForm.name.value,
    description: addForm.description.value,
    category: addForm.category.value,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then(() => {
    addForm.reset();
  });
});

const deleteForm = document.querySelector(".delete");
deleteForm.addEventListener("submit", (event) => {
  // Prevent the form's default behavior
  event.preventDefault();
  const documentRef = doc(db, "movies", deleteForm.id.value);
  deleteDoc(documentRef).then(() => {
    deleteForm.reset();
  });
});

const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (event) => {
  // Prevent the form's default behavior
  event.preventDefault();
  const documentRef = doc(db, "movies", updateForm.id.value);
  updateDoc(documentRef, {
    name: updateForm.name.value,
    description: updateForm.description.value,
    updatedAt: serverTimestamp(),
  }).then(() => {
    updateForm.reset();
  });
});

const registerForm = document.querySelector(".register");
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  createUserWithEmailAndPassword(
    auth,
    registerForm.email.value,
    registerForm.password.value,
  )
    .then((credentials) => {
      console.log(`credentials passed: ${JSON.stringify(credentials)}`);
      registerForm.reset();
    })
    .catch((error) => {
      console.log(`error while registering: ${error}`);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  signInWithEmailAndPassword(
    auth,
    loginForm.email.value,
    loginForm.password.value,
  )
    .then((credentials) => {
      console.log(`credentials passed: ${JSON.stringify(credentials)}`);
      loginForm.reset();
    })
    .catch((error) => {
      console.log(`error while logging in: ${error}`);
    });
});

const logoutForm = document.querySelector(".logout");
logoutForm.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("logging off current user...");
  console.log(auth.currentUser);
  signOut(auth)
    .then(() => {
      console.log("User logged out of Firebase");
    })
    .catch((error) => {
      console.log(`error while logging in: ${error}`);
    });
});
