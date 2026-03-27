// // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // import { 
// // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // //   doc, setDoc, updateDoc, limit 
// // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // const firebaseConfig = {
// // // // //   apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
// // // // //   authDomain: "webchat-1bfe4.firebaseapp.com",
// // // // //   projectId: "webchat-1bfe4",
// // // // //   storageBucket: "webchat-1bfe4.firebasestorage.app",
// // // // //   messagingSenderId: "262087743590",
// // // // //   appId: "1:262087743590:web:53934198aca60e81acf5a7"
// // // // // };

// // // // // const app = initializeApp(firebaseConfig);
// // // // // const db = getFirestore(app);

// // // // // const username = localStorage.getItem("username");
// // // // // if (!username) location.href = "index.html";

// // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // const messagesRef = collection(db, "messages");
// // // // // const box = document.getElementById("messages");

// // // // // /* ================= 1. ONLINE / LAST SEEN SYSTEM ================= */
// // // // // const userStatusRef = doc(db, "status", username);
// // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // const updateStatus = (state) => {
// // // // //   setDoc(userStatusRef, { state: state, last_changed: Date.now() }, { merge: true });
// // // // // };

// // // // // // Jab page open ho
// // // // // updateStatus("online");

// // // // // // Jab page band ya background mein jaye
// // // // // window.addEventListener("beforeunload", () => updateStatus("offline"));
// // // // // document.addEventListener("visibilitychange", () => {
// // // // //   updateStatus(document.visibilityState === 'visible' ? "online" : "offline");
// // // // // });

// // // // // // Samne wale ka status listen karna
// // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // //   const el = document.getElementById("user-status");
// // // // //   if (snap.exists()) {
// // // // //     const data = snap.data();
// // // // //     if (data.state === "online") {
// // // // //       el.textContent = "Online";
// // // // //       el.classList.add("status-online");
// // // // //     } else {
// // // // //       const time = new Date(data.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // //       el.textContent = `Last seen at ${time}`;
// // // // //       el.classList.remove("status-online");
// // // // //     }
// // // // //   }
// // // // // });

// // // // // /* ================= 2. REAL-TIME MESSAGES & SEEN ================= */
// // // // // const q = query(messagesRef, orderBy("time", "desc"), limit(100));

// // // // // onSnapshot(q, (snap) => {
// // // // //   const shouldScroll = box.scrollHeight - box.scrollTop - box.clientHeight < 100;
  
// // // // //   // Naya data aate hi box clear karke re-render (Real-time Seen ke liye)
// // // // //   box.innerHTML = "";

// // // // //   const docs = [...snap.docs].reverse();

// // // // //   docs.forEach((d) => {
// // // // //     const m = d.data();
// // // // //     const isMe = m.sender === username;
// // // // //     const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // // // //     const html = `
// // // // //       <div class="msg-row ${isMe ? "me-row" : "other-row"}" id="${d.id}">
// // // // //         <div class="bubble ${isMe ? "me" : "other"}">${m.text}</div>
// // // // //         <div class="msg-meta">
// // // // //           <span>${time}</span>
// // // // //           ${isMe ? ` • <span class="seen-status">${m.seen ? 'Seen' : 'Sent'}</span>` : ''}
// // // // //         </div>
// // // // //       </div>`;
    
// // // // //     box.insertAdjacentHTML("beforeend", html);

// // // // //     // Auto-mark as seen
// // // // //     if (!isMe && !m.seen) {
// // // // //       updateDoc(d.ref, { seen: true });
// // // // //     }
// // // // //   });

// // // // //   if (shouldScroll) box.scrollTop = box.scrollHeight;
// // // // // });

// // // // // /* ================= 3. ACTIONS ================= */
// // // // // window.sendMessage = async () => {
// // // // //   const input = document.getElementById("msg");
// // // // //   const text = input.value.trim();
// // // // //   if (!text) return;

// // // // //   input.value = "";
// // // // //   await addDoc(messagesRef, {
// // // // //     sender: username,
// // // // //     text: text,
// // // // //     time: Date.now(),
// // // // //     seen: false
// // // // //   });
// // // // // };

// // // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // // document.getElementById("msg").onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

// // // // // window.logout = async () => {
// // // // //   await updateStatus("offline");
// // // // //   localStorage.removeItem("username");
// // // // //   location.href = "index.html";
// // // // // };
// // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // import { 
// // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // //   doc, setDoc, updateDoc, limit, getDocs, startAfter 
// // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // /* ================= 1. CONFIGURATION ================= */
// // // // const firebaseConfig = {
// // // //   apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
// // // //   authDomain: "webchat-1bfe4.firebaseapp.com",
// // // //   projectId: "webchat-1bfe4",
// // // //   storageBucket: "webchat-1bfe4.firebasestorage.app",
// // // //   messagingSenderId: "262087743590",
// // // //   appId: "1:262087743590:web:53934198aca60e81acf5a7"
// // // // };

// // // // const app = initializeApp(firebaseConfig);
// // // // const db = getFirestore(app);

// // // // /* ================= 2. USER SESSION ================= */
// // // // const username = localStorage.getItem("username");
// // // // if (!username) location.href = "index.html";

// // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // document.getElementById("chat-name").textContent = otherUser;

// // // // const messagesRef = collection(db, "messages");
// // // // const box = document.getElementById("messages");
// // // // const loader = document.getElementById("chat-loader");

// // // // let lastVisible = null;
// // // // let isLoading = false;
// // // // let displayedIds = new Set();
// // // // const CHUNK_SIZE = 20;

// // // // /* ================= 3. PRESENCE (ONLINE/OFFLINE) ================= */
// // // // const userStatusRef = doc(db, "status", username);
// // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // const setStatus = (state) => setDoc(userStatusRef, { 
// // // //   state: state, 
// // // //   last_changed: Date.now() 
// // // // }, { merge: true });

// // // // // Initial status
// // // // setStatus("online");

// // // // // Tab change ya close hone par status update
// // // // window.addEventListener("beforeunload", () => setStatus("offline"));
// // // // document.addEventListener("visibilitychange", () => {
// // // //   setStatus(document.visibilityState === 'visible' ? "online" : "offline");
// // // // });

// // // // // Other user status listener
// // // // onSnapshot(otherStatusRef, (snap) => {
// // // //   const el = document.getElementById("user-status");
// // // //   if (snap.exists()) {
// // // //     const data = snap.data();
// // // //     if (data.state === "online") {
// // // //       el.textContent = "Online";
// // // //       el.className = "status-text status-online";
// // // //     } else {
// // // //       const time = new Date(data.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // //       el.textContent = `Last seen at ${time}`;
// // // //       el.className = "status-text";
// // // //     }
// // // //   }
// // // // });

// // // // /* ================= 4. MESSAGE RENDERING ================= */
// // // // function getMsgHTML(m, id) {
// // // //   const isMe = m.sender === username;
// // // //   const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // //   return `
// // // //     <div class="msg-row ${isMe ? "me-row" : "other-row"}" data-id="${id}">
// // // //       <div class="bubble ${isMe ? "me" : "other"}">${m.text}</div>
// // // //       <div class="msg-meta">
// // // //         <span>${time}</span>
// // // //         ${isMe ? ` • <span class="seen-status">${m.seen ? 'Seen' : 'Sent'}</span>` : ''}
// // // //       </div>
// // // //     </div>`;
// // // // }

// // // // /* ================= 5. LIVE SNAPSHOT + CHUNKING ================= */

// // // // // A. Real-time updates (Naye messages aur Seen status)
// // // // const liveQuery = query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE));
// // // // onSnapshot(liveQuery, (snap) => {
// // // //   const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 100;

// // // //   snap.docChanges().forEach(change => {
// // // //     const data = change.doc.data();
// // // //     const id = change.doc.id;

// // // //     if (change.type === "added" && !displayedIds.has(id)) {
// // // //       box.insertAdjacentHTML("beforeend", getMsgHTML(data, id));
// // // //       displayedIds.add(id);
// // // //       // Mark as seen if received
// // // //       if (data.sender !== username && !data.seen) {
// // // //         updateDoc(change.doc.ref, { seen: true });
// // // //       }
// // // //     } 
    
// // // //     if (change.type === "modified") {
// // // //       const row = box.querySelector(`[data-id="${id}"] .seen-status`);
// // // //       if (row && data.sender === username) {
// // // //         row.textContent = data.seen ? "Seen" : "Sent";
// // // //       }
// // // //     }
// // // //   });

// // // //   if (isAtBottom) box.scrollTop = box.scrollHeight;
// // // //   // Initialize lastVisible for chunking
// // // //   if (!lastVisible && !snap.empty) {
// // // //     lastVisible = snap.docs[snap.docs.length - 1];
// // // //   }
// // // // });

// // // // // B. Load Older Messages (Chunking)
// // // // async function loadOlderMessages() {
// // // //   if (isLoading || !lastVisible) return;
// // // //   isLoading = true;
// // // //   loader.classList.remove("hidden");

// // // //   const q = query(messagesRef, orderBy("time", "desc"), startAfter(lastVisible), limit(CHUNK_SIZE));
// // // //   const snap = await getDocs(q);

// // // //   if (!snap.empty) {
// // // //     const oldHeight = box.scrollHeight;
// // // //     snap.docs.forEach(d => {
// // // //       if (!displayedIds.has(d.id)) {
// // // //         // Prepend logic: loader ke theek niche insert karna
// // // //         loader.insertAdjacentHTML("afterend", getMsgHTML(d.data(), d.id));
// // // //         displayedIds.add(d.id);
// // // //       }
// // // //     });
// // // //     lastVisible = snap.docs[snap.docs.length - 1];
// // // //     box.scrollTop = box.scrollHeight - oldHeight;
// // // //   }
  
// // // //   loader.classList.add("hidden");
// // // //   isLoading = false;
// // // // }

// // // // // Scroll detection for chunking
// // // // box.onscroll = () => {
// // // //   if (box.scrollTop === 0) loadOlderMessages();
// // // // };

// // // // /* ================= 6. ACTIONS ================= */
// // // // window.sendMessage = async () => {
// // // //   const input = document.getElementById("msg");
// // // //   const text = input.value.trim();
// // // //   if (!text) return;
// // // //   input.value = "";
// // // //   await addDoc(messagesRef, {
// // // //     sender: username,
// // // //     text: text,
// // // //     time: Date.now(),
// // // //     seen: false
// // // //   });
// // // // };

// // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // document.getElementById("msg").onkeypress = (e) => {
// // // //   if(e.key === "Enter") window.sendMessage();
// // // // };

// // // // window.logout = async () => {
// // // //   await setStatus("offline");
// // // //   localStorage.removeItem("username");
// // // //   location.href = "index.html";
// // // // };
// // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // import { 
// // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // //   doc, setDoc, updateDoc, limit, getDocs, startAfter 
// // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // const firebaseConfig = {
// // //   apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
// // //   authDomain: "webchat-1bfe4.firebaseapp.com",
// // //   projectId: "webchat-1bfe4",
// // //   storageBucket: "webchat-1bfe4.firebasestorage.app",
// // //   messagingSenderId: "262087743590",
// // //   appId: "1:262087743590:web:53934198aca60e81acf5a7"
// // // };

// // // const app = initializeApp(firebaseConfig);
// // // const db = getFirestore(app);

// // // const username = localStorage.getItem("username");
// // // if (!username) location.href = "index.html";

// // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // document.getElementById("chat-name").textContent = otherUser;

// // // const messagesRef = collection(db, "messages");
// // // const box = document.getElementById("messages");
// // // const loader = document.getElementById("chat-loader");
// // // const typingContainer = document.getElementById("typing-container");

// // // let lastVisible = null;
// // // let isLoading = false;
// // // let allMessages = []; // Saare messages yahan store honge order fix karne ke liye
// // // const CHUNK_SIZE = 25;

// // // /* ================= 1. STATUS & TYPING ================= */
// // // const userStatusRef = doc(db, "status", username);
// // // const otherStatusRef = doc(db, "status", otherUser);

// // // const setStatus = (state, isTyping = false) => {
// // //   setDoc(userStatusRef, { state, isTyping, last_changed: Date.now() }, { merge: true });
// // // };

// // // setStatus("online", false);
// // // window.addEventListener("beforeunload", () => setStatus("offline", false));

// // // onSnapshot(otherStatusRef, (snap) => {
// // //   const el = document.getElementById("user-status");
// // //   if (snap.exists()) {
// // //     const d = snap.data();
// // //     typingContainer.classList.toggle('hidden', !d.isTyping);
// // //     if (d.state === "online") {
// // //       el.textContent = "Online";
// // //       el.className = "status-text status-online";
// // //     } else {
// // //       const time = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // //       el.textContent = `Last seen at ${time}`;
// // //       el.className = "status-text";
// // //     }
// // //   }
// // // });

// // // /* ================= 2. RENDERING ENGINE (The Fix) ================= */
// // // function renderMessages() {
// // //   // Time ke basis par sort karna (Sabse purana upar, naya neeche)
// // //   allMessages.sort((a, b) => a.time - b.time);

// // //   const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 100;
  
// // //   // Box clear karke naye sorted order mein daalna
// // //   box.innerHTML = `<div id="chat-loader" class="${isLoading ? '' : 'hidden'}"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;
  
// // //   allMessages.forEach(m => {
// // //     const isMe = m.sender === username;
// // //     const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // //     const html = `
// // //       <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // //         <div class="bubble ${isMe ? "me" : "other"}">${m.text}</div>
// // //         <div class="msg-meta">
// // //           <span>${time}</span>
// // //           ${isMe ? ` • <span class="seen-status">${m.seen ? 'Seen' : 'Sent'}</span>` : ''}
// // //         </div>
// // //       </div>`;
// // //     box.insertAdjacentHTML("beforeend", html);
// // //   });

// // //   if (isAtBottom) box.scrollTop = box.scrollHeight;
// // // }

// // // /* ================= 3. REAL-TIME SNAPSHOT ================= */
// // // const qLive = query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE));

// // // onSnapshot(qLive, (snap) => {
// // //   snap.docChanges().forEach(change => {
// // //     const data = { id: change.doc.id, ...change.doc.data() };
    
// // //     if (change.type === "added") {
// // //       // Check if already exists to avoid duplicates
// // //       if (!allMessages.find(m => m.id === data.id)) {
// // //         allMessages.push(data);
// // //         if (data.sender !== username && !data.seen) updateDoc(change.doc.ref, { seen: true });
// // //       }
// // //     } 
// // //     if (change.type === "modified") {
// // //       const index = allMessages.findIndex(m => m.id === data.id);
// // //       if (index !== -1) allMessages[index] = data;
// // //     }
// // //   });

// // //   if (!lastVisible && !snap.empty) lastVisible = snap.docs[snap.docs.length - 1];
// // //   renderMessages();
// // // });

// // // /* ================= 4. CHUNKING (LOAD MORE) ================= */
// // // async function loadMore() {
// // //   if (isLoading || !lastVisible) return;
// // //   isLoading = true;
// // //   document.getElementById("chat-loader").classList.remove("hidden");

// // //   const qMore = query(messagesRef, orderBy("time", "desc"), startAfter(lastVisible), limit(CHUNK_SIZE));
// // //   const snap = await getDocs(qMore);

// // //   if (!snap.empty) {
// // //     const oldHeight = box.scrollHeight;
// // //     snap.docs.forEach(d => {
// // //       const data = { id: d.id, ...d.data() };
// // //       if (!allMessages.find(m => m.id === data.id)) {
// // //         allMessages.push(data);
// // //       }
// // //     });
// // //     lastVisible = snap.docs[snap.docs.length - 1];
// // //     renderMessages();
// // //     box.scrollTop = box.scrollHeight - oldHeight;
// // //   }
  
// // //   isLoading = false;
// // //   document.getElementById("chat-loader").classList.add("hidden");
// // // }

// // // box.onscroll = () => { if (box.scrollTop === 0) loadMore(); };

// // // /* ================= 5. ACTIONS ================= */
// // // const input = document.getElementById("msg");
// // // let typingTimer;

// // // input.addEventListener("input", () => {
// // //   setStatus("online", true);
// // //   clearTimeout(typingTimer);
// // //   typingTimer = setTimeout(() => setStatus("online", false), 2000);
// // // });

// // // window.sendMessage = async () => {
// // //   const text = input.value.trim();
// // //   if (!text) return;
// // //   input.value = "";
// // //   setStatus("online", false);
// // //   await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // // };

// // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

// // // window.logout = () => {
// // //   setStatus("offline", false);
// // //   localStorage.removeItem("username");
// // //   location.href = "index.html";
// // // };
// // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // import { 
// //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// //   doc, setDoc, updateDoc, limit, getDocs, startAfter 
// // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // /* ================= 1. FIREBASE CONFIG ================= */
// // const firebaseConfig = {
// //   apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
// //   authDomain: "webchat-1bfe4.firebaseapp.com",
// //   projectId: "webchat-1bfe4",
// //   storageBucket: "webchat-1bfe4.firebasestorage.app",
// //   messagingSenderId: "262087743590",
// //   appId: "1:262087743590:web:53934198aca60e81acf5a7"
// // };

// // const app = initializeApp(firebaseConfig);
// // const db = getFirestore(app);

// // /* ================= 2. SETUP & VARIABLES ================= */
// // const username = localStorage.getItem("username");
// // if (!username) location.href = "index.html";

// // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // document.getElementById("chat-name").textContent = otherUser;

// // const messagesRef = collection(db, "messages");
// // const box = document.getElementById("messages");
// // const loader = document.getElementById("chat-loader");
// // const typingContainer = document.getElementById("typing-container");

// // let allMessages = []; 
// // let lastVisible = null;
// // let isLoading = false;
// // let isInitialLoad = true; // Animation control ke liye
// // const CHUNK_SIZE = 25;

// // /* ================= 3. STATUS & TYPING ================= */
// // const userStatusRef = doc(db, "status", username);
// // const otherStatusRef = doc(db, "status", otherUser);

// // const setStatus = (state, isTyping = false) => {
// //   setDoc(userStatusRef, { state, isTyping, last_changed: Date.now() }, { merge: true });
// // };

// // setStatus("online", false);

// // // Typing Detection
// // let typingTimer;
// // const handleTyping = () => {
// //   setStatus("online", true);
// //   clearTimeout(typingTimer);
// //   typingTimer = setTimeout(() => setStatus("online", false), 2000);
// // };

// // // Listen to Other User (Online/Typing)
// // onSnapshot(otherStatusRef, (snap) => {
// //   const el = document.getElementById("user-status");
// //   if (snap.exists()) {
// //     const d = snap.data();
// //     typingContainer.classList.toggle('hidden', !d.isTyping);
// //     if (d.state === "online") {
// //       el.textContent = "Online";
// //       el.className = "status-text status-online";
// //     } else {
// //       const time = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //       el.textContent = `Last seen at ${time}`;
// //       el.className = "status-text";
// //     }
// //   }
// // });

// // /* ================= 4. RENDER ENGINE (Order & Animation) ================= */
// // function renderMessages() {
// //   // Time ke hisab se sort (Sabse purana upar, naya neeche)
// //   allMessages.sort((a, b) => a.time - b.time);

// //   const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 150;
  
// //   box.innerHTML = `<div id="chat-loader" class="${isLoading ? '' : 'hidden'}">Loading...</div>`;
  
// //   allMessages.forEach((m) => {
// //     const isMe = m.sender === username;
// //     const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
// //     // Animation Logic: Pehli baar load par animation nahi, sirf naye messages par
// //     const animClass = isInitialLoad ? 'no-anim' : 'new-msg-anim';

// //     const html = `
// //       <div class="msg-row ${isMe ? "me-row" : "other-row"} ${animClass}" data-id="${m.id}">
// //         <div class="bubble ${isMe ? "me" : "other"}">${m.text}</div>
// //         <div class="msg-meta">
// //           <span>${time}</span>
// //           ${isMe ? ` • <span class="seen-status">${m.seen ? 'Seen' : 'Sent'}</span>` : ''}
// //         </div>
// //       </div>`;
// //     box.insertAdjacentHTML("beforeend", html);
// //   });

// //   if (isAtBottom || isInitialLoad) {
// //     box.scrollTop = box.scrollHeight;
// //   }
// // }

// // /* ================= 5. LIVE SNAPSHOT ================= */
// // const qLive = query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE));

// // onSnapshot(qLive, (snap) => {
// //   snap.docChanges().forEach(change => {
// //     const data = { id: change.doc.id, ...change.doc.data() };
    
// //     if (change.type === "added") {
// //       if (!allMessages.find(m => m.id === data.id)) {
// //         allMessages.push(data);
// //         // Mark Received Messages as Seen
// //         if (data.sender !== username && !data.seen) updateDoc(change.doc.ref, { seen: true });
// //       }
// //     } 
// //     if (change.type === "modified") {
// //       const index = allMessages.findIndex(m => m.id === data.id);
// //       if (index !== -1) allMessages[index] = data;
// //     }
// //   });

// //   if (!lastVisible && !snap.empty) lastVisible = snap.docs[snap.docs.length - 1];
  
// //   renderMessages();
// //   isInitialLoad = false; // Initial sync ke baad flag off
// // });

// // /* ================= 6. CHUNKING (LOAD MORE) ================= */
// // async function loadMore() {
// //   if (isLoading || !lastVisible) return;
// //   isLoading = true;
// //   isInitialLoad = true; // Taaki load more ke waqt naye messages animate na karein (UI stable rahe)
  
// //   const qMore = query(messagesRef, orderBy("time", "desc"), startAfter(lastVisible), limit(CHUNK_SIZE));
// //   const snap = await getDocs(qMore);

// //   if (!snap.empty) {
// //     const oldHeight = box.scrollHeight;
// //     snap.docs.forEach(d => {
// //       const data = { id: d.id, ...d.data() };
// //       if (!allMessages.find(m => m.id === data.id)) allMessages.push(data);
// //     });
// //     lastVisible = snap.docs[snap.docs.length - 1];
// //     renderMessages();
// //     box.scrollTop = box.scrollHeight - oldHeight;
// //   }
  
// //   isLoading = false;
// // }

// // box.onscroll = () => { if (box.scrollTop === 0) loadMore(); };

// // /* ================= 7. ACTIONS ================= */
// // const input = document.getElementById("msg");
// // input.addEventListener("input", handleTyping);

// // window.sendMessage = async () => {
// //   const text = input.value.trim();
// //   if (!text) return;
// //   input.value = "";
// //   setStatus("online", false);
// //   await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // };

// // document.getElementById("send-btn").onclick = window.sendMessage;
// // input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

// // window.logout = () => {
// //   setStatus("offline", false);
// //   localStorage.removeItem("username");
// //   location.href = "index.html";
// // };

// // window.addEventListener("beforeunload", () => setStatus("offline", false));
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { 
//   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
//   doc, setDoc, updateDoc, limit, getDocs, startAfter 
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// /* ================= 1. FIREBASE CONFIG ================= */
// const firebaseConfig = {
//   apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
//   authDomain: "webchat-1bfe4.firebaseapp.com",
//   projectId: "webchat-1bfe4",
//   storageBucket: "webchat-1bfe4.firebasestorage.app",
//   messagingSenderId: "262087743590",
//   appId: "1:262087743590:web:53934198aca60e81acf5a7"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// /* ================= 2. SETUP & VARIABLES ================= */
// const username = localStorage.getItem("username");
// if (!username) location.href = "index.html";

// const otherUser = username === "pratham" ? "Adhya" : "pratham";
// document.getElementById("chat-name").textContent = otherUser;

// const messagesRef = collection(db, "messages");
// const box = document.getElementById("messages");
// const loader = document.getElementById("chat-loader");
// const typingContainer = document.getElementById("typing-container");

// let allMessages = []; 
// let lastVisible = null;
// let isLoading = false;
// let isInitialLoad = true;
// const CHUNK_SIZE = 25;

// /* ================= 3. REAL-TIME PRESENCE LOGIC (THE FIX) ================= */
// const userStatusRef = doc(db, "status", username);
// const otherStatusRef = doc(db, "status", otherUser);

// // Status Update Function
// const setStatus = (state, isTyping = false) => {
//   setDoc(userStatusRef, { 
//     state: state, 
//     isTyping: isTyping, 
//     last_changed: Date.now() 
//   }, { merge: true });
// };

// // 1. Jab page load ho -> Online
// setStatus("online", false);

// // 2. Jab tab close ho ya refresh ho -> Last Seen update
// window.addEventListener("beforeunload", () => {
//   setStatus("offline", false);
// });

// // 3. Jab user tab switch kare ya minimize kare (Mobile/PC dono ke liye)
// document.addEventListener("visibilitychange", () => {
//   if (document.visibilityState === "visible") {
//     setStatus("online", false);
//   } else {
//     setStatus("offline", false);
//   }
// });

// // 4. Dusre user ka status monitor karna
// onSnapshot(otherStatusRef, (snap) => {
//   const el = document.getElementById("user-status");
//   if (snap.exists()) {
//     const d = snap.data();
    
//     // Typing Animation logic
//     typingContainer.classList.toggle('hidden', !d.isTyping);

//     if (d.state === "online") {
//       el.textContent = "Online";
//       el.className = "status-text status-online";
//     } else {
//       const time = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       el.textContent = `Last seen at ${time}`;
//       el.className = "status-text";
//     }
//   }
// });

// /* ================= 4. TYPING DETECTION ================= */
// let typingTimer;
// const handleTyping = () => {
//   setStatus("online", true);
//   clearTimeout(typingTimer);
//   typingTimer = setTimeout(() => {
//     // Check if still online before setting typing false
//     if (document.visibilityState === "visible") setStatus("online", false);
//   }, 2000);
// };

// /* ================= 5. RENDER ENGINE (Order & Animation) ================= */
// function renderMessages() {
//   allMessages.sort((a, b) => a.time - b.time);
//   const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 150;
  
//   box.innerHTML = `<div id="chat-loader" class="${isLoading ? '' : 'hidden'}">Loading...</div>`;
  
//   allMessages.forEach((m) => {
//     const isMe = m.sender === username;
//     const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     const animClass = isInitialLoad ? 'no-anim' : 'new-msg-anim';

//     const html = `
//       <div class="msg-row ${isMe ? "me-row" : "other-row"} ${animClass}" data-id="${m.id}">
//         <div class="bubble ${isMe ? "me" : "other"}">${m.text}</div>
//         <div class="msg-meta">
//           <span>${time}</span>
//           ${isMe ? ` • <span class="seen-status">${m.seen ? 'Seen' : 'Sent'}</span>` : ''}
//         </div>
//       </div>`;
//     box.insertAdjacentHTML("beforeend", html);
//   });

//   if (isAtBottom || isInitialLoad) box.scrollTop = box.scrollHeight;
// }

// /* ================= 6. LIVE SYNC & CHUNKING ================= */
// const qLive = query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE));

// onSnapshot(qLive, (snap) => {
//   snap.docChanges().forEach(change => {
//     const data = { id: change.doc.id, ...change.doc.data() };
//     if (change.type === "added") {
//       if (!allMessages.find(m => m.id === data.id)) {
//         allMessages.push(data);
//         if (data.sender !== username && !data.seen) updateDoc(change.doc.ref, { seen: true });
//       }
//     } 
//     if (change.type === "modified") {
//       const index = allMessages.findIndex(m => m.id === data.id);
//       if (index !== -1) allMessages[index] = data;
//     }
//   });
//   if (!lastVisible && !snap.empty) lastVisible = snap.docs[snap.docs.length - 1];
//   renderMessages();
//   isInitialLoad = false;
// });

// async function loadMore() {
//   if (isLoading || !lastVisible) return;
//   isLoading = true;
//   isInitialLoad = true;
//   const qMore = query(messagesRef, orderBy("time", "desc"), startAfter(lastVisible), limit(CHUNK_SIZE));
//   const snap = await getDocs(qMore);
//   if (!snap.empty) {
//     const oldHeight = box.scrollHeight;
//     snap.docs.forEach(d => {
//       const data = { id: d.id, ...d.data() };
//       if (!allMessages.find(m => m.id === data.id)) allMessages.push(data);
//     });
//     lastVisible = snap.docs[snap.docs.length - 1];
//     renderMessages();
//     box.scrollTop = box.scrollHeight - oldHeight;
//   }
//   isLoading = false;
// }

// box.onscroll = () => { if (box.scrollTop === 0) loadMore(); };

// /* ================= 7. ACTIONS ================= */
// const input = document.getElementById("msg");
// input.addEventListener("input", handleTyping);

// window.sendMessage = async () => {
//   const text = input.value.trim();
//   if (!text) return;
//   input.value = "";
//   setStatus("online", false);
//   await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// };

// document.getElementById("send-btn").onclick = window.sendMessage;
// input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

// window.logout = () => {
//   setStatus("offline", false);
//   localStorage.removeItem("username");
//   location.href = "index.html";
// };
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
  doc, setDoc, updateDoc, limit, getDocs, startAfter, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= 1. FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDtmTgb_1K7bm5bf8NyLvx68Eh_CGM_jKE",
  authDomain: "webchat-1bfe4.firebaseapp.com",
  projectId: "webchat-1bfe4",
  storageBucket: "webchat-1bfe4.firebasestorage.app",
  messagingSenderId: "262087743590",
  appId: "1:262087743590:web:53934198aca60e81acf5a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= 2. SETUP & VARIABLES ================= */
const username = localStorage.getItem("username");
if (!username) location.href = "index.html";

const otherUser = username === "pratham" ? "Adhya" : "pratham";
document.getElementById("chat-name").textContent = otherUser;

const messagesRef = collection(db, "messages");
const box = document.getElementById("messages");
const loader = document.getElementById("chat-loader");
const typingContainer = document.getElementById("typing-container");

let allMessages = []; 
let lastVisible = null;
let isLoading = false;
let isInitialLoad = true;
const CHUNK_SIZE = 25;

/* ================= 3. SMART PRESENCE (Multi-Tab Fix) ================= */
const userStatusRef = doc(db, "status", username);
const otherStatusRef = doc(db, "status", otherUser);

const setStatus = (state, isTyping = false) => {
  setDoc(userStatusRef, { 
    state: state, 
    isTyping: isTyping, 
    last_changed: Date.now() 
  }, { merge: true });
};

// Initial Online
setStatus("online", false);

// Heartbeat for multi-tab stability
setInterval(() => {
  if (document.visibilityState === "visible") setStatus("online", false);
}, 10000);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    setStatus("online", false);
  } else {
    setTimeout(() => {
      if (document.visibilityState !== "visible") setStatus("offline", false);
    }, 1500);
  }
});

onSnapshot(otherStatusRef, (snap) => {
  const el = document.getElementById("user-status");
  if (snap.exists()) {
    const d = snap.data();
    typingContainer.classList.toggle('hidden', !d.isTyping);
    if (d.state === "online") {
      el.textContent = "Online";
      el.className = "status-text status-online";
    } else {
      const time = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      el.textContent = `Last seen at ${time}`;
      el.className = "status-text";
    }
  }
});

/* ================= 4. TYPING DETECTION ================= */
let typingTimer;
const handleTyping = () => {
  setStatus("online", true);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    if (document.visibilityState === "visible") setStatus("online", false);
  }, 2000);
};

/* ================= 5. RENDER ENGINE (Order & Animation) ================= */
function renderMessages() {
  allMessages.sort((a, b) => a.time - b.time);
  const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 150;
  
  box.innerHTML = `<div id="chat-loader" class="${isLoading ? '' : 'hidden'}">Loading...</div>`;
  
  allMessages.forEach((m) => {
    const isMe = m.sender === username;
    const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const animClass = isInitialLoad ? 'no-anim' : 'new-msg-anim';

    const html = `
      <div class="msg-row ${isMe ? "me-row" : "other-row"} ${animClass}" data-id="${m.id}">
        <div class="bubble ${isMe ? "me" : "other"}">${m.text}</div>
        <div class="msg-meta">
          <span>${time}</span>
          ${isMe ? ` • <span class="seen-status">${m.seen ? 'Seen' : 'Sent'}</span>` : ''}
        </div>
      </div>`;
    box.insertAdjacentHTML("beforeend", html);
  });

  if (isAtBottom || isInitialLoad) box.scrollTop = box.scrollHeight;
}

/* ================= 6. LIVE SYNC & REAL-TIME DELETE ================= */
const qLive = query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE));

onSnapshot(qLive, (snap) => {
  snap.docChanges().forEach(change => {
    const data = { id: change.doc.id, ...change.doc.data() };
    
    if (change.type === "added") {
      if (!allMessages.find(m => m.id === data.id)) {
        allMessages.push(data);
        if (data.sender !== username && !data.seen) updateDoc(change.doc.ref, { seen: true });
      }
    } 
    if (change.type === "modified") {
      const index = allMessages.findIndex(m => m.id === data.id);
      if (index !== -1) allMessages[index] = data;
    }
    if (change.type === "removed") {
      // Step 1: Array se nikalo
      allMessages = allMessages.filter(m => m.id !== data.id);
      // Step 2: UI se smooth fade out karo
      const el = box.querySelector(`[data-id="${data.id}"]`);
      if (el) {
        el.classList.add('msg-removed');
        setTimeout(() => renderMessages(), 400); // Animation ke baad re-render
      }
    }
  });

  if (!lastVisible && !snap.empty) lastVisible = snap.docs[snap.docs.length - 1];
  
  // Refresh UI for Add/Modify
  if (!snap.docChanges().every(c => c.type === "removed")) {
    renderMessages();
  }
  isInitialLoad = false;
});

/* ================= 7. CHUNKING (LOAD MORE) ================= */
async function loadMore() {
  if (isLoading || !lastVisible) return;
  isLoading = true;
  isInitialLoad = true;
  const qMore = query(messagesRef, orderBy("time", "desc"), startAfter(lastVisible), limit(CHUNK_SIZE));
  const snap = await getDocs(qMore);
  if (!snap.empty) {
    const oldHeight = box.scrollHeight;
    snap.docs.forEach(d => {
      const data = { id: d.id, ...d.data() };
      if (!allMessages.find(m => m.id === data.id)) allMessages.push(data);
    });
    lastVisible = snap.docs[snap.docs.length - 1];
    renderMessages();
    box.scrollTop = box.scrollHeight - oldHeight;
  }
  isLoading = false;
}

box.onscroll = () => { if (box.scrollTop === 0) loadMore(); };

/* ================= 8. ACTIONS ================= */
const input = document.getElementById("msg");
input.addEventListener("input", handleTyping);

window.sendMessage = async () => {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  setStatus("online", false);
  await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
};

document.getElementById("send-btn").onclick = window.sendMessage;
input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

window.logout = () => {
  setStatus("offline", false);
  localStorage.removeItem("username");
  location.href = "index.html";
};

window.addEventListener("pagehide", () => setStatus("offline", false));