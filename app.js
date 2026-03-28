import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
//   authDomain: "webchat-1bfe4.firebaseapp.com",
//   projectId: "webchat-1bfe4",
//   storageBucket: "webchat-1bfe4.firebasestorage.app",
//   messagingSenderId: "262087743590",
//   appId: "1:262087743590:web:53934198aca60e81acf5a7"
// };

const firebaseConfig = {
  apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
  authDomain: "new-webchat.firebaseapp.com",
  projectId: "new-webchat",
  storageBucket: "new-webchat.firebasestorage.app",
  messagingSenderId: "815354080113",
  appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.login = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Fill all fields ❗");
    return;
  }

  const ref = doc(db, "users", username);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("User not found!");
  } else if (snap.data().password === password) {
    localStorage.setItem("username", username);
    location.href = "chat.html";
  } else {
    alert("Wrong password!");
  }
};