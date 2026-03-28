// // // // // // // // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // // // // // // // import { 
// // // // // // // // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // // // // // // // //   doc, setDoc, updateDoc, limit, getDocs, startAfter 
// // // // // // // // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // // // // // // // /* ================= 1. FIREBASE CONFIG ================= */
// // // // // // // // // // // // // // const firebaseConfig = {
// // // // // // // // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // // // // // // // //   projectId: "new-webchat",
// // // // // // // // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // // // // // // // };
// // // // // // // // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // // // // // // // const db = getFirestore(app);

// // // // // // // // // // // // // // /* ================= 1.5 DRIVE CONFIG ================= */
// // // // // // // // // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // // // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM'; // <--- Yahan apni Google Drive Folder ID daalo

// // // // // // // // // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // // // // // // // // const hash = window.location.hash.substring(1);
// // // // // // // // // // // // // // const params = new URLSearchParams(hash);
// // // // // // // // // // // // // // const newToken = params.get('access_token');

// // // // // // // // // // // // // // if (newToken) {
// // // // // // // // // // // // // //     driveToken = newToken;
// // // // // // // // // // // // // //     localStorage.setItem('drive_token', newToken);
// // // // // // // // // // // // // //     window.history.replaceState({}, document.title, window.location.pathname);
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // /* ================= 2. SETUP & DOM ELEMENTS ================= */
// // // // // // // // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // // // // // // // if (!username) location.href = "index.html";

// // // // // // // // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // // // // // // // // const messagesRef = collection(db, "messages");
// // // // // // // // // // // // // // const box = document.getElementById("messages");
// // // // // // // // // // // // // // const input = document.getElementById("msg");
// // // // // // // // // // // // // // const fileInput = document.getElementById("drive-upload");
// // // // // // // // // // // // // // const micBtn = document.getElementById("mic-btn");
// // // // // // // // // // // // // // const typingContainer = document.getElementById("typing-container");

// // // // // // // // // // // // // // const modal = document.getElementById("media-modal");
// // // // // // // // // // // // // // const modalContent = document.querySelector(".modal-content");
// // // // // // // // // // // // // // const closeModal = document.querySelector(".close-modal");

// // // // // // // // // // // // // // let allMessages = []; 
// // // // // // // // // // // // // // let lastVisible = null; 
// // // // // // // // // // // // // // let isLoading = false;
// // // // // // // // // // // // // // let isInitialLoad = true;
// // // // // // // // // // // // // // const CHUNK_SIZE = 30;

// // // // // // // // // // // // // // // Voice Recording Logic
// // // // // // // // // // // // // // let mediaRecorder;
// // // // // // // // // // // // // // let audioChunks = [];

// // // // // // // // // // // // // // /* ================= 3. ONLINE / LAST SEEN / TYPING ================= */
// // // // // // // // // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // // // // // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // // // // // // // // // // const setStatus = (state, isTyping = false) => {
// // // // // // // // // // // // // //   setDoc(userStatusRef, { state, isTyping, last_changed: Date.now() }, { merge: true });
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // // // // // // // // //   const el = document.getElementById("user-status");
// // // // // // // // // // // // // //   if (snap.exists()) {
// // // // // // // // // // // // // //     const d = snap.data();
// // // // // // // // // // // // // //     typingContainer.classList.toggle('hidden', !d.isTyping);
// // // // // // // // // // // // // //     if (d.state === "online") {
// // // // // // // // // // // // // //       el.textContent = "Online";
// // // // // // // // // // // // // //       el.className = "status-text status-online";
// // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // //       const time = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // // // // // // // // //       el.textContent = `Last seen at ${time}`;
// // // // // // // // // // // // // //       el.className = "status-text";
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   }
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // Typing Event
// // // // // // // // // // // // // // let typingTimer;
// // // // // // // // // // // // // // input.addEventListener("input", () => {
// // // // // // // // // // // // // //   setStatus("online", true);
// // // // // // // // // // // // // //   clearTimeout(typingTimer);
// // // // // // // // // // // // // //   typingTimer = setTimeout(() => { setStatus("online", false); }, 2000);
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // setStatus("online", false);

// // // // // // // // // // // // // // /* ================= 4. DRIVE UPLOAD ENGINE (XHR) ================= */
// // // // // // // // // // // // // // function uploadWithProgress(file, onProgress) {
// // // // // // // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // // // // // // //         const metadata = { name: file.name, mimeType: file.type, parents: [FOLDER_ID] };
// // // // // // // // // // // // // //         const formData = new FormData();
// // // // // // // // // // // // // //         formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // // // // // // // // //         formData.append('file', file);

// // // // // // // // // // // // // //         const xhr = new XMLHttpRequest();
// // // // // // // // // // // // // //         xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // // // // // // // // //         xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);

// // // // // // // // // // // // // //         xhr.upload.onprogress = (e) => {
// // // // // // // // // // // // // //             if (e.lengthComputable && onProgress) {
// // // // // // // // // // // // // //                 const percent = Math.round((e.loaded / e.total) * 100);
// // // // // // // // // // // // // //                 onProgress(percent);
// // // // // // // // // // // // // //             }
// // // // // // // // // // // // // //         };

// // // // // // // // // // // // // //         xhr.onload = async () => {
// // // // // // // // // // // // // //             if (xhr.status === 200) {
// // // // // // // // // // // // // //                 const data = JSON.parse(xhr.response);
// // // // // // // // // // // // // //                 await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
// // // // // // // // // // // // // //                     method: 'POST',
// // // // // // // // // // // // // //                     headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // // // // // // // // //                     body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // // // // // // // // //                 });
// // // // // // // // // // // // // //                 resolve(data.id);
// // // // // // // // // // // // // //             } else { reject('Upload Error'); }
// // // // // // // // // // // // // //         };
// // // // // // // // // // // // // //         xhr.send(formData);
// // // // // // // // // // // // // //     });
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // /* ================= 5. RENDER ENGINE ================= */
// // // // // // // // // // // // // // function renderMessages(maintainScroll = false) {
// // // // // // // // // // // // // //   allMessages.sort((a, b) => a.time - b.time);
// // // // // // // // // // // // // //   const oldHeight = box.scrollHeight;
// // // // // // // // // // // // // //   box.innerHTML = '';
  
// // // // // // // // // // // // // //   allMessages.forEach((m) => {
// // // // // // // // // // // // // //     const isMe = m.sender === username;
// // // // // // // // // // // // // //     const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // // // // // // // // // // // // //     let content = '';
// // // // // // // // // // // // // //     if (m.isUploading) {
// // // // // // // // // // // // // //         const deg = (m.progress / 100) * 360;
// // // // // // // // // // // // // //         content = `
// // // // // // // // // // // // // //             <div class="upload-preview" style="position:relative; width:180px; height:120px; background:#121212; border-radius:12px; display:flex; justify-content:center; align-items:center; overflow:hidden;">
// // // // // // // // // // // // // //                 ${m.localUrl ? `<video src="${m.localUrl}" style="width:100%; height:100%; object-fit:cover; opacity:0.3;"></video>` : '<div style="color:#555">Sending...</div>'}
// // // // // // // // // // // // // //                 <div id="prog-circle-${m.id}" style="position:absolute; width:50px; height:50px; background: conic-gradient(#00a884 ${deg}deg, rgba(255,255,255,0.1) ${deg}deg); border-radius:50%; display:flex; justify-content:center; align-items:center;">
// // // // // // // // // // // // // //                     <div id="prog-text-${m.id}" style="width:40px; height:40px; background:#121212; border-radius:50%; display:flex; justify-content:center; align-items:center; color:white; font-size:12px;">${m.progress}%</div>
// // // // // // // // // // // // // //                 </div>
// // // // // // // // // // // // // //             </div>`;
// // // // // // // // // // // // // //     } else if (m.driveId) {
// // // // // // // // // // // // // //         if (m.fileType === 'image') {
// // // // // // // // // // // // // //             const thumbUrl = `https://lh3.googleusercontent.com/u/0/d/${m.driveId}`;
// // // // // // // // // // // // // //             content = `<img src="${thumbUrl}" class="chat-media" onclick="openModal('${m.driveId}', 'image')" style="border-radius:12px; max-width:200px; cursor:pointer;">`;
// // // // // // // // // // // // // //         } else if (m.fileType === 'video') {
// // // // // // // // // // // // // //             content = `<div class="video-wrapper" onclick="openModal('${m.driveId}', 'video')" style="position:relative; cursor:pointer;">
// // // // // // // // // // // // // //                         <img src="https://lh3.googleusercontent.com/u/0/d/${m.driveId}" class="chat-media" style="border-radius:12px; filter: brightness(0.7); max-width:200px;">
// // // // // // // // // // // // // //                         <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:35px;"><i class="fas fa-play-circle"></i></div>
// // // // // // // // // // // // // //                        </div>`;
// // // // // // // // // // // // // //         } else if (m.fileType === 'audio') {
// // // // // // // // // // // // // //             const audioUrl = `https://drive.google.com/uc?export=download&id=${m.driveId}`;
// // // // // // // // // // // // // //             content = `<audio controls style="width:210px;"><source src="${audioUrl}" type="audio/mpeg"></audio>`;
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // //         content = `<span>${m.text}</span>`;
// // // // // // // // // // // // // //     }

// // // // // // // // // // // // // //     box.insertAdjacentHTML("beforeend", `
// // // // // // // // // // // // // //       <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // // // // // // // //         <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // // // // // // // //         <div class="msg-meta" style="font-size:10px; margin-top:4px; opacity:0.6;">${time} ${isMe ? '✓✓' : ''}</div>
// // // // // // // // // // // // // //       </div>`);
// // // // // // // // // // // // // //   });

// // // // // // // // // // // // // //   if (maintainScroll) box.scrollTop = box.scrollHeight - oldHeight;
// // // // // // // // // // // // // //   else box.scrollTop = box.scrollHeight;
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // /* ================= 6. FIREBASE REAL-TIME SYNC ================= */
// // // // // // // // // // // // // // const qMessages = query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE));
// // // // // // // // // // // // // // onSnapshot(qMessages, (snap) => {
// // // // // // // // // // // // // //   snap.docChanges().forEach(change => {
// // // // // // // // // // // // // //     const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // // // // // // // //     if (change.type === "added") {
// // // // // // // // // // // // // //       // Temp removal if real one arrives
// // // // // // // // // // // // // //       allMessages = allMessages.filter(m => !m.isUploading || m.fileName !== data.fileName);
// // // // // // // // // // // // // //       if (!allMessages.find(m => m.id === data.id)) allMessages.push(data);
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   });
// // // // // // // // // // // // // //   renderMessages();
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // /* ================= 7. SEND ACTIONS (TEXT, FILE, VOICE) ================= */
// // // // // // // // // // // // // // window.sendMessage = async () => {
// // // // // // // // // // // // // //   const text = input.value.trim();
// // // // // // // // // // // // // //   if (!text) return;
// // // // // // // // // // // // // //   input.value = "";
// // // // // // // // // // // // // //   setStatus("online", false);
// // // // // // // // // // // // // //   await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // // // // // // // // // // // input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

// // // // // // // // // // // // // // // File Upload
// // // // // // // // // // // // // // document.getElementById("attach-btn").onclick = () => {
// // // // // // // // // // // // // //     if (!driveToken) {
// // // // // // // // // // // // // //         const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${DRIVE_CLIENT_ID}&redirect_uri=${window.location.href}&response_type=token&scope=https://www.googleapis.com/auth/drive.file`;
// // // // // // // // // // // // // //         window.location.href = authUrl;
// // // // // // // // // // // // // //     } else { fileInput.click(); }
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // fileInput.onchange = async (e) => {
// // // // // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // // // // //     if (!file) return;
// // // // // // // // // // // // // //     const tempId = "f-" + Date.now();
// // // // // // // // // // // // // //     const localUrl = URL.createObjectURL(file);
// // // // // // // // // // // // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, localUrl, fileName: file.name, time: Date.now() });
// // // // // // // // // // // // // //     renderMessages();

// // // // // // // // // // // // // //     const fileId = await uploadWithProgress(file, (p) => {
// // // // // // // // // // // // // //         const txt = document.getElementById(`prog-text-${tempId}`);
// // // // // // // // // // // // // //         const circle = document.getElementById(`prog-circle-${tempId}`);
// // // // // // // // // // // // // //         if(txt) txt.innerText = p + "%";
// // // // // // // // // // // // // //         if(circle) circle.style.background = `conic-gradient(#00a884 ${(p/100)*360}deg, rgba(255,255,255,0.1) ${(p/100)*360}deg)`;
// // // // // // // // // // // // // //     });

// // // // // // // // // // // // // //     if(fileId) {
// // // // // // // // // // // // // //         await addDoc(messagesRef, { sender: username, driveId: fileId, fileType: file.type.split('/')[0], time: Date.now(), fileName: file.name });
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // Voice Note (Hold to Record)
// // // // // // // // // // // // // // micBtn.onmousedown = async () => {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// // // // // // // // // // // // // //         mediaRecorder = new MediaRecorder(stream);
// // // // // // // // // // // // // //         audioChunks = [];
// // // // // // // // // // // // // //         mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
// // // // // // // // // // // // // //         mediaRecorder.onstop = async () => {
// // // // // // // // // // // // // //             const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
// // // // // // // // // // // // // //             const audioFile = new File([audioBlob], `v_${Date.now()}.mp3`, { type: 'audio/mp3' });
// // // // // // // // // // // // // //             const tempId = "v-" + Date.now();
// // // // // // // // // // // // // //             allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, fileName: audioFile.name, time: Date.now() });
// // // // // // // // // // // // // //             renderMessages();
// // // // // // // // // // // // // //             const fileId = await uploadWithProgress(audioFile, (p) => {
// // // // // // // // // // // // // //                  const txt = document.getElementById(`prog-text-${tempId}`);
// // // // // // // // // // // // // //                  if(txt) txt.innerText = p + "%";
// // // // // // // // // // // // // //             });
// // // // // // // // // // // // // //             if(fileId) await addDoc(messagesRef, { sender: username, driveId: fileId, fileType: 'audio', time: Date.now(), fileName: audioFile.name });
// // // // // // // // // // // // // //         };
// // // // // // // // // // // // // //         mediaRecorder.start();
// // // // // // // // // // // // // //         micBtn.style.color = "#ff4757";
// // // // // // // // // // // // // //     } catch(err) { alert("Mic access denied!"); }
// // // // // // // // // // // // // // };
// // // // // // // // // // // // // // micBtn.onmouseup = () => { if(mediaRecorder) mediaRecorder.stop(); micBtn.style.color = ""; };

// // // // // // // // // // // // // // /* ================= 8. LOGOUT & MODAL ================= */
// // // // // // // // // // // // // // window.logout = () => {
// // // // // // // // // // // // // //   setStatus("offline", false);
// // // // // // // // // // // // // //   localStorage.clear();
// // // // // // // // // // // // // //   location.href = "index.html";
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // window.openModal = (driveId, type) => {
// // // // // // // // // // // // // //     modalContent.innerHTML = '';
// // // // // // // // // // // // // //     if (type === 'image') {
// // // // // // // // // // // // // //         modalContent.innerHTML = `<img src="https://lh3.googleusercontent.com/u/0/d/${driveId}" style="max-width:90vw; max-height:90vh; object-fit:contain; border-radius:12px;">`;
// // // // // // // // // // // // // //     } else if (type === 'video') {
// // // // // // // // // // // // // //         modalContent.innerHTML = `
// // // // // // // // // // // // // //             <div style="width:90vw; height:90vh; display:flex; justify-content:center; align-items:center; overflow:hidden; border-radius:12px;">
// // // // // // // // // // // // // //                 <iframe src="https://drive.google.com/file/d/${driveId}/preview" style="width:100%; height:100%; border:none;" allow="autoplay; fullscreen"></iframe>
// // // // // // // // // // // // // //             </div>`;
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //     modal.classList.remove('hidden');
// // // // // // // // // // // // // //     document.body.style.overflow = 'hidden';
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // window.closeMediaModal = () => {
// // // // // // // // // // // // // //     modal.classList.add('hidden');
// // // // // // // // // // // // // //     modalContent.innerHTML = '';
// // // // // // // // // // // // // //     document.body.style.overflow = '';
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // closeModal.onclick = window.closeMediaModal;
// // // // // // // // // // // // // // modal.onclick = (e) => { if (e.target === modal) window.closeMediaModal(); };

// // // // // // // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // // // // // // import { 
// // // // // // // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // // // // // // //   doc, setDoc, updateDoc, limit, getDocs, startAfter 
// // // // // // // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // // // // // // /* ================= 1. CONFIG ================= */
// // // // // // // // // // // // // const firebaseConfig = {
// // // // // // // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // // // // // // //   projectId: "new-webchat",
// // // // // // // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // // // // // // };
// // // // // // // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // // // // // // const db = getFirestore(app);

// // // // // // // // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM'; 

// // // // // // // // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // // // // // // // const hash = window.location.hash.substring(1);
// // // // // // // // // // // // // const params = new URLSearchParams(hash);
// // // // // // // // // // // // // const newToken = params.get('access_token');

// // // // // // // // // // // // // if (newToken) {
// // // // // // // // // // // // //     driveToken = newToken;
// // // // // // // // // // // // //     localStorage.setItem('drive_token', newToken);
// // // // // // // // // // // // //     window.history.replaceState({}, document.title, window.location.pathname);
// // // // // // // // // // // // // }

// // // // // // // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // // // // // // if (!username) location.href = "index.html";
// // // // // // // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // // // // // // // const messagesRef = collection(db, "messages");
// // // // // // // // // // // // // const box = document.getElementById("messages");
// // // // // // // // // // // // // const input = document.getElementById("msg");
// // // // // // // // // // // // // const fileInput = document.getElementById("drive-upload");
// // // // // // // // // // // // // const micBtn = document.getElementById("mic-btn");
// // // // // // // // // // // // // const typingContainer = document.getElementById("typing-container");

// // // // // // // // // // // // // let allMessages = []; 
// // // // // // // // // // // // // const CHUNK_SIZE = 30;
// // // // // // // // // // // // // let mediaRecorder;
// // // // // // // // // // // // // let audioChunks = [];

// // // // // // // // // // // // // /* ================= 2. ONLINE / LAST SEEN FIX ================= */
// // // // // // // // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // // // // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // // // // // // // // // const setStatus = (state, isTyping = false) => {
// // // // // // // // // // // // //   setDoc(userStatusRef, { state, isTyping, last_changed: Date.now() }, { merge: true });
// // // // // // // // // // // // // };

// // // // // // // // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // // // // // // // //   const el = document.getElementById("user-status");
// // // // // // // // // // // // //   if (snap.exists()) {
// // // // // // // // // // // // //     const d = snap.data();
// // // // // // // // // // // // //     typingContainer.classList.toggle('hidden', !d.isTyping);
// // // // // // // // // // // // //     if (d.state === "online") {
// // // // // // // // // // // // //       el.textContent = "Online";
// // // // // // // // // // // // //       el.className = "status-text status-online";
// // // // // // // // // // // // //     } else {
// // // // // // // // // // // // //       const time = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // // // // // // // //       el.textContent = `Last seen at ${time}`;
// // // // // // // // // // // // //       el.className = "status-text";
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // input.addEventListener("input", () => {
// // // // // // // // // // // // //   setStatus("online", true);
// // // // // // // // // // // // //   clearTimeout(window.tTimer);
// // // // // // // // // // // // //   window.tTimer = setTimeout(() => setStatus("online", false), 2000);
// // // // // // // // // // // // // });
// // // // // // // // // // // // // setStatus("online", false);

// // // // // // // // // // // // // /* ================= 3. DRIVE PREVIEW SYSTEM ================= */
// // // // // // // // // // // // // async function getPreviewUrl(driveId) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         const resp = await fetch(`https://www.googleapis.com/drive/v3/files/${driveId}?fields=thumbnailLink`, {
// // // // // // // // // // // // //             headers: { 'Authorization': `Bearer ${driveToken}` }
// // // // // // // // // // // // //         });
// // // // // // // // // // // // //         const data = await resp.json();
// // // // // // // // // // // // //         return data.thumbnailLink ? data.thumbnailLink.replace(/=s\d+/, "=s500") : null;
// // // // // // // // // // // // //     } catch (e) { return null; }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // /* ================= 4. RENDER ENGINE (UI FIXED) ================= */
// // // // // // // // // // // // // async function renderMessages() {
// // // // // // // // // // // // //   allMessages.sort((a, b) => a.time - b.time);
// // // // // // // // // // // // //   box.innerHTML = '';
  
// // // // // // // // // // // // //   for (const m of allMessages) {
// // // // // // // // // // // // //     const isMe = m.sender === username;
// // // // // // // // // // // // //     const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // // // // // // // //     let content = '';

// // // // // // // // // // // // //     if (m.isUploading) {
// // // // // // // // // // // // //         content = `<div class="upload-bubble">Sending... ${m.progress}%</div>`;
// // // // // // // // // // // // //     } else if (m.driveId) {
// // // // // // // // // // // // //         if (m.fileType === 'image' || m.fileType === 'video') {
// // // // // // // // // // // // //             if (!m.cachedThumb) m.cachedThumb = await getPreviewUrl(m.driveId);
// // // // // // // // // // // // //             content = `
// // // // // // // // // // // // //                 <div class="media-container" onclick="window.openMedia('${m.driveId}', '${m.fileType}')" style="width:200px; height:150px; background:#111; border-radius:12px; overflow:hidden; position:relative; cursor:pointer;">
// // // // // // // // // // // // //                     <img src="${m.cachedThumb || 'https://via.placeholder.com/200x150?text=Loading'}" style="width:100%; height:100%; object-fit:cover;">
// // // // // // // // // // // // //                     ${m.fileType === 'video' ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:30px;"><i class="fas fa-play"></i></div>' : ''}
// // // // // // // // // // // // //                 </div>`;
// // // // // // // // // // // // //         } else if (m.fileType === 'audio') {
// // // // // // // // // // // // //             const url = `https://drive.google.com/uc?export=download&id=${m.driveId}`;
// // // // // // // // // // // // //             content = `<div class="audio-bubble" style="background:transparent; padding:0;"><audio controls src="${url}" style="width:220px; height:35px; filter:invert(100%);"></audio></div>`;
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     } else {
// // // // // // // // // // // // //         content = `<span>${m.text}</span>`;
// // // // // // // // // // // // //     }

// // // // // // // // // // // // //     box.insertAdjacentHTML("beforeend", `
// // // // // // // // // // // // //       <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // // // // // // //         <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // // // // // // //         <div class="msg-meta" style="font-size:10px; margin-top:4px; opacity:0.6;">${time} ${isMe ? '✓✓' : ''}</div>
// // // // // // // // // // // // //       </div>`);
// // // // // // // // // // // // //   }
// // // // // // // // // // // // //   box.scrollTop = box.scrollHeight;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // /* ================= 5. UPLOAD & SYNC ================= */
// // // // // // // // // // // // // function uploadWithProgress(file, onProgress) {
// // // // // // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // // // // // //         const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // // // // // // // // // // //         const formData = new FormData();
// // // // // // // // // // // // //         formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // // // // // // // //         formData.append('file', file);
// // // // // // // // // // // // //         const xhr = new XMLHttpRequest();
// // // // // // // // // // // // //         xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // // // // // // // //         xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
// // // // // // // // // // // // //         xhr.upload.onprogress = (e) => { if(onProgress) onProgress(Math.round((e.loaded/e.total)*100)); };
// // // // // // // // // // // // //         xhr.onload = async () => {
// // // // // // // // // // // // //             if (xhr.status === 200) {
// // // // // // // // // // // // //                 const fid = JSON.parse(xhr.response).id;
// // // // // // // // // // // // //                 await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // // // // // // // // // // //                     method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // // // // // // // //                     body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // // // // // // // //                 });
// // // // // // // // // // // // //                 resolve(fid);
// // // // // // // // // // // // //             } else reject();
// // // // // // // // // // // // //         };
// // // // // // // // // // // // //         xhr.send(formData);
// // // // // // // // // // // // //     });
// // // // // // // // // // // // // }

// // // // // // // // // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(CHUNK_SIZE)), (snap) => {
// // // // // // // // // // // // //   snap.docChanges().forEach(change => {
// // // // // // // // // // // // //     const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // // // // // // //     if (change.type === "added") {
// // // // // // // // // // // // //       allMessages = allMessages.filter(m => !m.isUploading || m.fileName !== data.fileName);
// // // // // // // // // // // // //       if (!allMessages.find(m => m.id === data.id)) allMessages.push(data);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   });
// // // // // // // // // // // // //   renderMessages();
// // // // // // // // // // // // // });

// // // // // // // // // // // // // window.sendMessage = async () => {
// // // // // // // // // // // // //   const text = input.value.trim();
// // // // // // // // // // // // //   if (!text) return;
// // // // // // // // // // // // //   input.value = "";
// // // // // // // // // // // // //   await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // // // // // // // };

// // // // // // // // // // // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // // // // // // // // // // input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };

// // // // // // // // // // // // // fileInput.onchange = async (e) => {
// // // // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // // // //     if (!file) return;
// // // // // // // // // // // // //     const tempId = "f-" + Date.now();
// // // // // // // // // // // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, fileName: file.name, time: Date.now() });
// // // // // // // // // // // // //     renderMessages();
// // // // // // // // // // // // //     const fid = await uploadWithProgress(file, (p) => {
// // // // // // // // // // // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // // // // // // // // // // //         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// // // // // // // // // // // // //     });
// // // // // // // // // // // // //     if(fid) await addDoc(messagesRef, { sender: username, driveId: fid, fileType: file.type.split('/')[0], time: Date.now(), fileName: file.name });
// // // // // // // // // // // // // };

// // // // // // // // // // // // // // Mic Fix
// // // // // // // // // // // // // micBtn.onmousedown = async () => {
// // // // // // // // // // // // //     const s = await navigator.mediaDevices.getUserMedia({ audio: true });
// // // // // // // // // // // // //     mediaRecorder = new MediaRecorder(s);
// // // // // // // // // // // // //     audioChunks = [];
// // // // // // // // // // // // //     mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
// // // // // // // // // // // // //     mediaRecorder.onstop = async () => {
// // // // // // // // // // // // //         const audioFile = new File([new Blob(audioChunks)], `v_${Date.now()}.mp3`, { type: 'audio/mp3' });
// // // // // // // // // // // // //         const fid = await uploadWithProgress(audioFile);
// // // // // // // // // // // // //         if(fid) await addDoc(messagesRef, { sender: username, driveId: fid, fileType: 'audio', time: Date.now(), fileName: audioFile.name });
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //     mediaRecorder.start();
// // // // // // // // // // // // //     micBtn.style.color = "red";
// // // // // // // // // // // // // };
// // // // // // // // // // // // // micBtn.onmouseup = () => { if(mediaRecorder) mediaRecorder.stop(); micBtn.style.color = ""; };

// // // // // // // // // // // // // window.openMedia = (driveId, type) => {
// // // // // // // // // // // // //     const modal = document.getElementById("media-modal");
// // // // // // // // // // // // //     const content = document.querySelector(".modal-content");
// // // // // // // // // // // // //     content.innerHTML = type === 'image' ? `<img src="https://drive.google.com/uc?export=download&id=${driveId}" style="max-width:90vw;">` : `<iframe src="https://drive.google.com/file/d/${driveId}/preview" style="width:90vw;height:80vh;"></iframe>`;
// // // // // // // // // // // // //     modal.classList.remove('hidden');
// // // // // // // // // // // // // };
// // // // // // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // // // // // import { 
// // // // // // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // // // // // //   doc, setDoc, updateDoc, limit 
// // // // // // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // // // // // /* ================= 1. CONFIG ================= */
// // // // // // // // // // // // const firebaseConfig = {
// // // // // // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // // // // // //   projectId: "new-webchat",
// // // // // // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // // // // // };
// // // // // // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // // // // // const db = getFirestore(app);

// // // // // // // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';

// // // // // // // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // // // // // // const hash = window.location.hash.substring(1);
// // // // // // // // // // // // const params = new URLSearchParams(hash);
// // // // // // // // // // // // if (params.get('access_token')) {
// // // // // // // // // // // //     driveToken = params.get('access_token');
// // // // // // // // // // // //     localStorage.setItem('drive_token', driveToken);
// // // // // // // // // // // //     window.history.replaceState({}, document.title, window.location.pathname);
// // // // // // // // // // // // }

// // // // // // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // // // // // // /* ================= 2. DOM ELEMENTS ================= */
// // // // // // // // // // // // const messagesRef = collection(db, "messages");
// // // // // // // // // // // // const box = document.getElementById("messages");
// // // // // // // // // // // // const input = document.getElementById("msg");
// // // // // // // // // // // // const fileInput = document.getElementById("drive-upload");

// // // // // // // // // // // // let allMessages = []; 

// // // // // // // // // // // // /* ================= 3. RENDER ENGINE (LINK ONLY) ================= */
// // // // // // // // // // // // function renderMessages() {
// // // // // // // // // // // //     const uniqueMap = new Map();
// // // // // // // // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // // // // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // // // // // // // //     box.innerHTML = '';
    
// // // // // // // // // // // //     for (const m of sortedMsgs) {
// // // // // // // // // // // //         const isMe = m.sender === username;
// // // // // // // // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // // // // // // //         let content = '';

// // // // // // // // // // // //         if (m.isUploading) {
// // // // // // // // // // // //             content = `<div style="font-style:italic; opacity:0.7;">Uploading File: ${m.progress}%</div>`;
// // // // // // // // // // // //         } else if (m.driveId) {
// // // // // // // // // // // //             // Yahan Thumbnail ki jagah Direct Link generate ho rahi hai
// // // // // // // // // // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // // // // // // // // // //             content = `
// // // // // // // // // // // //                 <div class="file-link-bubble" style="display:flex; align-items:center; gap:10px; padding:5px;">
// // // // // // // // // // // //                     <i class="fas fa-file-alt" style="font-size:20px;"></i>
// // // // // // // // // // // //                     <div style="text-align:left;">
// // // // // // // // // // // //                         <div style="font-size:12px; font-weight:bold; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.fileName || 'Shared File'}</div>
// // // // // // // // // // // //                         <a href="${fileLink}" target="_blank" style="color:#34b7f1; text-decoration:none; font-size:13px; font-weight:bold;">View File ↗</a>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                 </div>`;
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             content = `<span>${m.text}</span>`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // // // // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // // // // // //                 <div class="msg-meta">${time}</div>
// // // // // // // // // // // //             </div>`);
// // // // // // // // // // // //     }
// // // // // // // // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // // // // // // // }

// // // // // // // // // // // // /* ================= 4. REAL-TIME SYNC ================= */
// // // // // // // // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(40)), (snap) => {
// // // // // // // // // // // //     snap.docChanges().forEach(change => {
// // // // // // // // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // // // // // //         if (change.type === "added") {
// // // // // // // // // // // //             allMessages = allMessages.filter(m => !(m.isUploading && m.fileName === data.fileName));
// // // // // // // // // // // //             allMessages.push(data);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     });
// // // // // // // // // // // //     renderMessages();
// // // // // // // // // // // // });

// // // // // // // // // // // // /* ================= 5. UPLOAD LOGIC ================= */
// // // // // // // // // // // // window.sendMessage = async () => {
// // // // // // // // // // // //     const text = input.value.trim();
// // // // // // // // // // // //     if (!text) return;
// // // // // // // // // // // //     input.value = "";
// // // // // // // // // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // // // // // // };

// // // // // // // // // // // // document.getElementById("send-btn").onclick = window.sendMessage;

// // // // // // // // // // // // document.getElementById("attach-btn").onclick = () => {
// // // // // // // // // // // //     if (!driveToken) {
// // // // // // // // // // // //         location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${DRIVE_CLIENT_ID}&redirect_uri=${window.location.href.split('#')[0]}&response_type=token&scope=https://www.googleapis.com/auth/drive.file`;
// // // // // // // // // // // //     } else { fileInput.click(); }
// // // // // // // // // // // // };

// // // // // // // // // // // // fileInput.onchange = async (e) => {
// // // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // // //     if (!file) return;

// // // // // // // // // // // //     const tempId = "temp-" + Date.now();
// // // // // // // // // // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, fileName: file.name, time: Date.now() });
// // // // // // // // // // // //     renderMessages();

// // // // // // // // // // // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // // // // // // // // // //     const formData = new FormData();
// // // // // // // // // // // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // // // // // // //     formData.append('file', file);

// // // // // // // // // // // //     const xhr = new XMLHttpRequest();
// // // // // // // // // // // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // // // // // // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // // // // // // // // // // //     xhr.upload.onprogress = (ev) => {
// // // // // // // // // // // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // // // // // // // // // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // // // // // // // // // //         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// // // // // // // // // // // //     };

// // // // // // // // // // // //     xhr.onload = async () => {
// // // // // // // // // // // //         if (xhr.status === 200) {
// // // // // // // // // // // //             const fid = JSON.parse(xhr.response).id;
// // // // // // // // // // // //             // Permission set taaki Adhya dekh sake
// // // // // // // // // // // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // // // // // // // // // //                 method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // // // // // // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // // // // // // //             });
// // // // // // // // // // // //             await addDoc(messagesRef, { 
// // // // // // // // // // // //                 sender: username, 
// // // // // // // // // // // //                 driveId: fid, 
// // // // // // // // // // // //                 fileName: file.name, 
// // // // // // // // // // // //                 time: Date.now() 
// // // // // // // // // // // //             });
// // // // // // // // // // // //         }
// // // // // // // // // // // //     };
// // // // // // // // // // // //     xhr.send(formData);
// // // // // // // // // // // // };

// // // // // // // // // // // // // Logout Function
// // // // // // // // // // // // window.logout = () => { localStorage.clear(); location.href = "index.html"; };
// // // // // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // // // // import { 
// // // // // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // // // // //   doc, setDoc, updateDoc, limit 
// // // // // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // // // // const firebaseConfig = {
// // // // // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // // // // //   projectId: "new-webchat",
// // // // // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // // // // };
// // // // // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // // // // const db = getFirestore(app);

// // // // // // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';

// // // // // // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // // // // // const messagesRef = collection(db, "messages");
// // // // // // // // // // // const box = document.getElementById("messages");
// // // // // // // // // // // const input = document.getElementById("msg");
// // // // // // // // // // // const fileInput = document.getElementById("drive-upload");

// // // // // // // // // // // let allMessages = []; 

// // // // // // // // // // // // --- 1. RENDER FUNCTION (SMOOTH & FAST) ---
// // // // // // // // // // // function renderMessages() {
// // // // // // // // // // //     const uniqueMap = new Map();
// // // // // // // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // // // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // // // // // // //     box.innerHTML = '';
// // // // // // // // // // //     sortedMsgs.forEach(m => {
// // // // // // // // // // //         const isMe = m.sender === username;
// // // // // // // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // // // // // //         let content = '';

// // // // // // // // // // //         if (m.isUploading) {
// // // // // // // // // // //             content = `
// // // // // // // // // // //                 <div class="upload-container" style="min-width:120px;">
// // // // // // // // // // //                     <div style="font-size:11px; margin-bottom:5px;">Uploading: ${m.fileName}</div>
// // // // // // // // // // //                     <div style="width:100%; background:#444; height:4px; border-radius:2px;">
// // // // // // // // // // //                         <div style="width:${m.progress}%; background:#34b7f1; height:100%; border-radius:2px; transition: width 0.3s;"></div>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                     <div style="font-size:10px; text-align:right; margin-top:3px;">${m.progress}%</div>
// // // // // // // // // // //                 </div>`;
// // // // // // // // // // //         } else if (m.driveId) {
// // // // // // // // // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // // // // // // // // //             content = `
// // // // // // // // // // //                 <div class="file-link-bubble" style="display:flex; align-items:center; gap:10px; padding:2px;">
// // // // // // // // // // //                     <i class="fas fa-file-video" style="font-size:20px; color:#ff4757;"></i>
// // // // // // // // // // //                     <div style="text-align:left;">
// // // // // // // // // // //                         <div style="font-size:12px; font-weight:bold; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.fileName}</div>
// // // // // // // // // // //                         <a href="${fileLink}" target="_blank" style="color:#34b7f1; text-decoration:none; font-size:13px; font-weight:bold;">View File ↗</a>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                 </div>`;
// // // // // // // // // // //         } else {
// // // // // // // // // // //             content = `<span>${m.text}</span>`;
// // // // // // // // // // //         }

// // // // // // // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // // // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // // // // //                 <div class="msg-meta">${time}</div>
// // // // // // // // // // //             </div>`);
// // // // // // // // // // //     });
// // // // // // // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // // // // // // }

// // // // // // // // // // // // --- 2. SYNC SYSTEM (PREVENTS REFRESH LAG) ---
// // // // // // // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(40)), (snap) => {
// // // // // // // // // // //     snap.docChanges().forEach(change => {
// // // // // // // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // // // // //         if (change.type === "added") {
// // // // // // // // // // //             // Agar ye file abhi upload ho kar aayi hai, toh local temp remove karo
// // // // // // // // // // //             allMessages = allMessages.filter(m => !(m.isUploading && m.fileName === data.fileName));
// // // // // // // // // // //             if(!allMessages.find(m => m.id === data.id)) allMessages.push(data);
// // // // // // // // // // //         }
// // // // // // // // // // //     });
// // // // // // // // // // //     renderMessages();
// // // // // // // // // // // });

// // // // // // // // // // // // --- 3. UPLOAD LOGIC (FIXED PROGRESS) ---
// // // // // // // // // // // fileInput.onchange = async (e) => {
// // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // //     if (!file || !driveToken) return;

// // // // // // // // // // //     const tempId = "temp-" + Date.now();
// // // // // // // // // // //     const tempMsg = { id: tempId, sender: username, isUploading: true, progress: 1, fileName: file.name, time: Date.now() };
// // // // // // // // // // //     allMessages.push(tempMsg);
// // // // // // // // // // //     renderMessages();

// // // // // // // // // // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // // // // // // // // //     const formData = new FormData();
// // // // // // // // // // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // // // // // //     formData.append('file', file);

// // // // // // // // // // //     const xhr = new XMLHttpRequest();
// // // // // // // // // // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // // // // // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // // // // // // // // // //     xhr.upload.onprogress = (ev) => {
// // // // // // // // // // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // // // // // // // // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // // // // // // // // //         if(idx !== -1) { 
// // // // // // // // // // //             allMessages[idx].progress = p || 1; // 1% start
// // // // // // // // // // //             renderMessages(); 
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     xhr.onload = async () => {
// // // // // // // // // // //         if (xhr.status === 200) {
// // // // // // // // // // //             const fid = JSON.parse(xhr.response).id;
// // // // // // // // // // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // // // // // // // // //                 method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // // // // // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // // // // // //             });
// // // // // // // // // // //             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now() });
// // // // // // // // // // //         }
// // // // // // // // // // //     };
// // // // // // // // // // //     xhr.send(formData);
// // // // // // // // // // // };

// // // // // // // // // // // // --- 4. STATUS SYSTEM (FIXED CHECKING...) ---
// // // // // // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // // // // // //     const el = document.getElementById("user-status");
// // // // // // // // // // //     if (snap.exists()) {
// // // // // // // // // // //         const d = snap.data();
// // // // // // // // // // //         if (d.state === "online") { el.textContent = "Online"; el.style.color = "#4cd137"; }
// // // // // // // // // // //         else { el.textContent = "Offline"; el.style.color = "#aaa"; }
// // // // // // // // // // //     } else {
// // // // // // // // // // //         el.textContent = "Offline";
// // // // // // // // // // //     }
// // // // // // // // // // // });
// // // // // // // // // // // setDoc(userStatusRef, { state: "online", last_changed: Date.now() }, { merge: true });
// // // // // // // // // // // window.addEventListener('beforeunload', () => setDoc(userStatusRef, { state: "offline" }, { merge: true }));

// // // // // // // // // // // window.sendMessage = async () => {
// // // // // // // // // // //     const text = input.value.trim();
// // // // // // // // // // //     if (!text) return;
// // // // // // // // // // //     input.value = "";
// // // // // // // // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // // // // // };
// // // // // // // // // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // // // // // // // // document.getElementById("attach-btn").onclick = () => driveToken ? fileInput.click() : alert("Please Login to Drive");
// // // // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // // // import { 
// // // // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // // // //   doc, setDoc, updateDoc, limit 
// // // // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // // // /* ================= 1. CONFIG & AUTH ================= */
// // // // // // // // // // const firebaseConfig = {
// // // // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // // // //   projectId: "new-webchat",
// // // // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // // // };
// // // // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // // // const db = getFirestore(app);

// // // // // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';

// // // // // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // // // if (!username) location.href = "index.html";

// // // // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // // // // /* ================= 2. DOM ELEMENTS ================= */
// // // // // // // // // // const messagesRef = collection(db, "messages");
// // // // // // // // // // const box = document.getElementById("messages");
// // // // // // // // // // const input = document.getElementById("msg");
// // // // // // // // // // const fileInput = document.getElementById("drive-upload");
// // // // // // // // // // const statusEl = document.getElementById("user-status");
// // // // // // // // // // const typingContainer = document.getElementById("typing-container");

// // // // // // // // // // let allMessages = []; 

// // // // // // // // // // /* ================= 3. RENDER ENGINE (NO DUPLICATES) ================= */
// // // // // // // // // // function renderMessages() {
// // // // // // // // // //     const uniqueMap = new Map();
// // // // // // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // // // // // //     box.innerHTML = '';
// // // // // // // // // //     sortedMsgs.forEach(m => {
// // // // // // // // // //         const isMe = m.sender === username;
// // // // // // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // // // // //         let content = '';

// // // // // // // // // //         if (m.isUploading) {
// // // // // // // // // //             content = `
// // // // // // // // // //                 <div class="upload-container" style="min-width:140px;">
// // // // // // // // // //                     <div style="font-size:11px; margin-bottom:5px;">Uploading... ${m.progress}%</div>
// // // // // // // // // //                     <div style="width:100%; background:rgba(255,255,255,0.1); height:4px; border-radius:2px;">
// // // // // // // // // //                         <div style="width:${m.progress}%; background:#34b7f1; height:100%; border-radius:2px; transition: width 0.3s;"></div>
// // // // // // // // // //                     </div>
// // // // // // // // // //                 </div>`;
// // // // // // // // // //         } else if (m.driveId) {
// // // // // // // // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // // // // // // // //             content = `
// // // // // // // // // //                 <div class="file-link-bubble" style="display:flex; align-items:center; gap:10px;">
// // // // // // // // // //                     <i class="fas fa-file-alt" style="font-size:18px; color:#34b7f1;"></i>
// // // // // // // // // //                     <div style="text-align:left;">
// // // // // // // // // //                         <div style="font-size:12px; font-weight:bold; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.fileName}</div>
// // // // // // // // // //                         <a href="${fileLink}" target="_blank" style="color:#34b7f1; text-decoration:none; font-size:13px;">View File ↗</a>
// // // // // // // // // //                     </div>
// // // // // // // // // //                 </div>`;
// // // // // // // // // //         } else {
// // // // // // // // // //             content = `<span>${m.text}</span>`;
// // // // // // // // // //         }

// // // // // // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // // // //                 <div class="msg-meta">${time}</div>
// // // // // // // // // //             </div>`);
// // // // // // // // // //     });
// // // // // // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // // // // // }

// // // // // // // // // // /* ================= 4. REAL-TIME SYNC ================= */
// // // // // // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // // // // // // // // //     snap.docChanges().forEach(change => {
// // // // // // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // // // //         if (change.type === "added") {
// // // // // // // // // //             // Remove local temp bubble when server data arrives
// // // // // // // // // //             allMessages = allMessages.filter(m => !(m.isUploading && m.fileName === data.fileName));
// // // // // // // // // //             if(!allMessages.find(m => m.id === data.id)) allMessages.push(data);
// // // // // // // // // //         }
// // // // // // // // // //     });
// // // // // // // // // //     renderMessages();
// // // // // // // // // // });

// // // // // // // // // // /* ================= 5. STATUS & TYPING SYSTEM ================= */
// // // // // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // // // // // // // Update Status (Online/Offline/Typing)
// // // // // // // // // // const updateMyStatus = (state, isTyping = false) => {
// // // // // // // // // //     setDoc(userStatusRef, { state, isTyping, last_changed: Date.now() }, { merge: true });
// // // // // // // // // // };

// // // // // // // // // // // Listen for Other User
// // // // // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // // // // //     if (snap.exists()) {
// // // // // // // // // //         const d = snap.data();
        
// // // // // // // // // //         // Handle Typing Indicator
// // // // // // // // // //         if (d.isTyping) {
// // // // // // // // // //             typingContainer.innerHTML = `${otherUser} is typing...`;
// // // // // // // // // //             typingContainer.style.display = "block";
// // // // // // // // // //         } else {
// // // // // // // // // //             typingContainer.style.display = "none";
// // // // // // // // // //         }

// // // // // // // // // //         // Handle Last Seen
// // // // // // // // // //         if (d.state === "online") {
// // // // // // // // // //             statusEl.textContent = "Online";
// // // // // // // // // //             statusEl.style.color = "#4cd137";
// // // // // // // // // //         } else {
// // // // // // // // // //             const lastSeen = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // // // // //             statusEl.textContent = `Last seen at ${lastSeen}`;
// // // // // // // // // //             statusEl.style.color = "#aaa";
// // // // // // // // // //         }
// // // // // // // // // //     }
// // // // // // // // // // });

// // // // // // // // // // // Typing Event Listener
// // // // // // // // // // let typingTimer;
// // // // // // // // // // input.addEventListener("input", () => {
// // // // // // // // // //     updateMyStatus("online", true);
// // // // // // // // // //     clearTimeout(typingTimer);
// // // // // // // // // //     typingTimer = setTimeout(() => updateMyStatus("online", false), 2000);
// // // // // // // // // // });

// // // // // // // // // // // Set Online on load
// // // // // // // // // // updateMyStatus("online");
// // // // // // // // // // window.addEventListener('beforeunload', () => updateMyStatus("offline"));

// // // // // // // // // // /* ================= 6. LOGOUT SYSTEM ================= */
// // // // // // // // // // window.logout = async () => {
// // // // // // // // // //     await updateMyStatus("offline");
// // // // // // // // // //     localStorage.clear();
// // // // // // // // // //     location.href = "index.html";
// // // // // // // // // // };
// // // // // // // // // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);

// // // // // // // // // // /* ================= 7. DRIVE UPLOAD ================= */
// // // // // // // // // // fileInput.onchange = async (e) => {
// // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // //     if (!file || !driveToken) return;

// // // // // // // // // //     const tempId = "temp-" + Date.now();
// // // // // // // // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 1, fileName: file.name, time: Date.now() });
// // // // // // // // // //     renderMessages();

// // // // // // // // // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // // // // // // // //     const formData = new FormData();
// // // // // // // // // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // // // // //     formData.append('file', file);

// // // // // // // // // //     const xhr = new XMLHttpRequest();
// // // // // // // // // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // // // // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // // // // // // // // //     xhr.upload.onprogress = (ev) => {
// // // // // // // // // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // // // // // // // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // // // // // // // //         if(idx !== -1) { 
// // // // // // // // // //             allMessages[idx].progress = p; 
// // // // // // // // // //             renderMessages(); 
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     xhr.onload = async () => {
// // // // // // // // // //         if (xhr.status === 200) {
// // // // // // // // // //             const fid = JSON.parse(xhr.response).id;
// // // // // // // // // //             // Public Permission
// // // // // // // // // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // // // // // // // //                 method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // // // // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // // // // //             });
// // // // // // // // // //             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now() });
// // // // // // // // // //         }
// // // // // // // // // //     };
// // // // // // // // // //     xhr.send(formData);
// // // // // // // // // // };

// // // // // // // // // // /* ================= 8. MESSAGE SENDING ================= */
// // // // // // // // // // window.sendMessage = async () => {
// // // // // // // // // //     const text = input.value.trim();
// // // // // // // // // //     if (!text) return;
// // // // // // // // // //     input.value = "";
// // // // // // // // // //     updateMyStatus("online", false);
// // // // // // // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // // // // };

// // // // // // // // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // // // // // // // input.onkeypress = (e) => { if(e.key === "Enter") window.sendMessage(); };
// // // // // // // // // // document.getElementById("attach-btn").onclick = () => fileInput.click();
// // // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // // import { 
// // // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // // //   doc, setDoc, updateDoc, limit 
// // // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // // /* ================= 1. CONFIG ================= */
// // // // // // // // // const firebaseConfig = {
// // // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // // //   projectId: "new-webchat",
// // // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // // };
// // // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // // const db = getFirestore(app);

// // // // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';

// // // // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // // if (!username) location.href = "index.html";

// // // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // // // /* ================= 2. DOM ELEMENTS ================= */
// // // // // // // // // const messagesRef = collection(db, "messages");
// // // // // // // // // const box = document.getElementById("messages");
// // // // // // // // // const input = document.getElementById("msg");
// // // // // // // // // const fileInput = document.getElementById("drive-upload");
// // // // // // // // // const statusEl = document.getElementById("user-status");
// // // // // // // // // const typingIndicator = document.getElementById("typing-indicator");

// // // // // // // // // let allMessages = []; 

// // // // // // // // // /* ================= 3. RENDER ENGINE ================= */
// // // // // // // // // function renderMessages() {
// // // // // // // // //     const uniqueMap = new Map();
// // // // // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // // // // //     box.innerHTML = '';
// // // // // // // // //     sortedMsgs.forEach(m => {
// // // // // // // // //         const isMe = m.sender === username;
// // // // // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // // // //         let content = '';

// // // // // // // // //         if (m.isUploading) {
// // // // // // // // //             content = `
// // // // // // // // //                 <div class="upload-container" style="min-width:140px;">
// // // // // // // // //                     <div style="font-size:11px; margin-bottom:5px;">Uploading... ${m.progress}%</div>
// // // // // // // // //                     <div style="width:100%; background:rgba(255,255,255,0.1); height:4px; border-radius:2px;">
// // // // // // // // //                         <div style="width:${m.progress}%; background:#34b7f1; height:100%; border-radius:2px; transition: width 0.3s;"></div>
// // // // // // // // //                     </div>
// // // // // // // // //                 </div>`;
// // // // // // // // //         } else if (m.driveId) {
// // // // // // // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // // // // // // //             content = `
// // // // // // // // //                 <div class="file-link-bubble" style="display:flex; align-items:center; gap:10px;">
// // // // // // // // //                     <i class="fas fa-file-alt" style="font-size:18px; color:#34b7f1;"></i>
// // // // // // // // //                     <div style="text-align:left;">
// // // // // // // // //                         <div style="font-size:12px; font-weight:bold; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.fileName}</div>
// // // // // // // // //                         <a href="${fileLink}" target="_blank" style="color:#34b7f1; text-decoration:none; font-size:13px; font-weight:bold;">View File ↗</a>
// // // // // // // // //                     </div>
// // // // // // // // //                 </div>`;
// // // // // // // // //         } else {
// // // // // // // // //             content = `<span>${m.text}</span>`;
// // // // // // // // //         }

// // // // // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // // //                 <div class="msg-meta">${time}</div>
// // // // // // // // //             </div>`);
// // // // // // // // //     });
// // // // // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // // // // }

// // // // // // // // // /* ================= 4. STATUS & TYPING SYNC ================= */
// // // // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // // // //     if (snap.exists()) {
// // // // // // // // //         const d = snap.data();
        
// // // // // // // // //         // Typing Indicator logic (Dots show only if other user is typing)
// // // // // // // // //         if (d.isTyping) {
// // // // // // // // //             typingIndicator.classList.remove("hidden");
// // // // // // // // //         } else {
// // // // // // // // //             typingIndicator.classList.add("hidden");
// // // // // // // // //         }

// // // // // // // // //         // Online/Last Seen logic
// // // // // // // // //         if (d.state === "online") {
// // // // // // // // //             statusEl.textContent = "Online";
// // // // // // // // //             statusEl.style.color = "#4cd137";
// // // // // // // // //         } else {
// // // // // // // // //             const lastSeen = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // // // //             statusEl.textContent = `Last seen at ${lastSeen}`;
// // // // // // // // //             statusEl.style.color = "#aaa";
// // // // // // // // //         }
// // // // // // // // //     }
// // // // // // // // // });

// // // // // // // // // // Detect My Typing
// // // // // // // // // let typingTimer;
// // // // // // // // // input.addEventListener("input", () => {
// // // // // // // // //     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
// // // // // // // // //     clearTimeout(typingTimer);
// // // // // // // // //     typingTimer = setTimeout(() => {
// // // // // // // // //         setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // // // // // // // //     }, 2000);
// // // // // // // // // });

// // // // // // // // // // Online on start
// // // // // // // // // setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });

// // // // // // // // // /* ================= 5. MESSAGE & MEDIA LOGIC ================= */
// // // // // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // // // // // // // //     snap.docChanges().forEach(change => {
// // // // // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // // //         if (change.type === "added") {
// // // // // // // // //             allMessages = allMessages.filter(m => !(m.isUploading && m.fileName === data.fileName));
// // // // // // // // //             if(!allMessages.find(m => m.id === data.id)) allMessages.push(data);
// // // // // // // // //         }
// // // // // // // // //     });
// // // // // // // // //     renderMessages();
// // // // // // // // // });

// // // // // // // // // window.sendMessage = async () => {
// // // // // // // // //     const text = input.value.trim();
// // // // // // // // //     if (!text) return;
// // // // // // // // //     input.value = "";
// // // // // // // // //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // // // // // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // // // };

// // // // // // // // // fileInput.onchange = async (e) => {
// // // // // // // // //     const file = e.target.files[0];
// // // // // // // // //     if (!file || !driveToken) return;

// // // // // // // // //     const tempId = "temp-" + Date.now();
// // // // // // // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 1, fileName: file.name, time: Date.now() });
// // // // // // // // //     renderMessages();

// // // // // // // // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // // // // // // //     const formData = new FormData();
// // // // // // // // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // // // //     formData.append('file', file);

// // // // // // // // //     const xhr = new XMLHttpRequest();
// // // // // // // // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // // // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // // // // // // // //     xhr.upload.onprogress = (ev) => {
// // // // // // // // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // // // // // // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // // // // // // //         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// // // // // // // // //     };

// // // // // // // // //     xhr.onload = async () => {
// // // // // // // // //         if (xhr.status === 200) {
// // // // // // // // //             const fid = JSON.parse(xhr.response).id;
// // // // // // // // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // // // // // // //                 method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // // // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // // // //             });
// // // // // // // // //             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now() });
// // // // // // // // //         }
// // // // // // // // //     };
// // // // // // // // //     xhr.send(formData);
// // // // // // // // // };

// // // // // // // // // /* ================= 6. LOGOUT ================= */
// // // // // // // // // window.logout = async () => {
// // // // // // // // //     await setDoc(userStatusRef, { state: "offline", last_changed: Date.now() }, { merge: true });
// // // // // // // // //     localStorage.clear();
// // // // // // // // //     location.href = "index.html";
// // // // // // // // // };

// // // // // // // // // document.getElementById("send-btn").onclick = window.sendMessage;
// // // // // // // // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);
// // // // // // // // // document.getElementById("attach-btn").onclick = () => fileInput.click();
// // // // // // // // // window.addEventListener('beforeunload', () => setDoc(userStatusRef, { state: "offline" }, { merge: true }));
// // // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // // import { 
// // // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // // //   doc, setDoc, limit 
// // // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // // /* ================= 1. CONFIG ================= */
// // // // // // // // const firebaseConfig = {
// // // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // // //   projectId: "new-webchat",
// // // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // // //   messagingSenderId: "815354080113",
// // // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // // };
// // // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // // const db = getFirestore(app);

// // // // // // // // const username = localStorage.getItem("username");
// // // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // // if (!username) location.href = "index.html";

// // // // // // // // document.getElementById("chat-name").textContent = otherUser;
// // // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // // const otherStatusRef = doc(db, "status", otherUser);

// // // // // // // // /* ================= 2. LINKIFY ONLY TEXT ================= */
// // // // // // // // function linkify(text) {
// // // // // // // //     if (!text) return "";
// // // // // // // //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// // // // // // // //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // // // // // // // }

// // // // // // // // /* ================= 3. RENDER MESSAGES ================= */
// // // // // // // // let allMessages = []; 
// // // // // // // // function renderMessages() {
// // // // // // // //     const box = document.getElementById("messages");
// // // // // // // //     const uniqueMap = new Map();
// // // // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // // // //     box.innerHTML = '';
// // // // // // // //     sortedMsgs.forEach(m => {
// // // // // // // //         const isMe = m.sender === username;
// // // // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // // //         let content = '';

// // // // // // // //         if (m.isUploading) {
// // // // // // // //             content = `<div class="upload-info">Uploading... ${m.progress}%</div>`;
// // // // // // // //         } else if (m.driveId) {
// // // // // // // //             // GDrive File: No linkify here, just the button
// // // // // // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // // // // // //             content = `
// // // // // // // //                 <div class="file-link-bubble" style="display:flex; align-items:center; gap:8px;">
// // // // // // // //                     <i class="fas fa-file-alt"></i>
// // // // // // // //                     <div style="text-align:left;">
// // // // // // // //                         <div style="font-size:11px; font-weight:bold; max-width:140px; overflow:hidden;">${m.fileName}</div>
// // // // // // // //                         <a href="${fileLink}" target="_blank" style="color:#34b7f1; font-weight:bold; font-size:12px;">View File ↗</a>
// // // // // // // //                     </div>
// // // // // // // //                 </div>`;
// // // // // // // //         } else {
// // // // // // // //             // Normal Text: Apply Linkify
// // // // // // // //             content = `<span>${linkify(m.text)}</span>`;
// // // // // // // //         }

// // // // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // // //                 <div class="msg-meta">${time}</div>
// // // // // // // //             </div>`);
// // // // // // // //     });
// // // // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // // // }

// // // // // // // // /* ================= 4. REAL-TIME STATUS & TYPING ================= */
// // // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // // //     if (!snap.exists()) return;
// // // // // // // //     const d = snap.data();
// // // // // // // //     const statusEl = document.getElementById("user-status");
// // // // // // // //     const typingInd = document.getElementById("typing-indicator");

// // // // // // // //     // Typing Logic
// // // // // // // //     if (d.isTyping) typingInd.classList.remove("hidden");
// // // // // // // //     else typingInd.classList.add("hidden");

// // // // // // // //     // Online/Last Seen Logic
// // // // // // // //     if (d.state === "online") {
// // // // // // // //         statusEl.textContent = "Online";
// // // // // // // //         statusEl.style.color = "#4cd137";
// // // // // // // //     } else {
// // // // // // // //         const lastSeen = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // // //         statusEl.textContent = `Last seen at ${lastSeen}`;
// // // // // // // //         statusEl.style.color = "#aaa";
// // // // // // // //     }
// // // // // // // // });

// // // // // // // // // Smart Visibility Status
// // // // // // // // const updateStatus = (s) => setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
// // // // // // // // document.addEventListener("visibilitychange", () => updateStatus(document.visibilityState === 'visible' ? "online" : "offline"));
// // // // // // // // updateStatus("online");

// // // // // // // // // Typing Listener
// // // // // // // // let tTimer;
// // // // // // // // document.getElementById("msg").addEventListener("input", () => {
// // // // // // // //     setDoc(userStatusRef, { isTyping: true }, { merge: true });
// // // // // // // //     clearTimeout(tTimer);
// // // // // // // //     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// // // // // // // // });

// // // // // // // // /* ================= 5. CORE ACTIONS ================= */
// // // // // // // // window.sendMessage = async () => {
// // // // // // // //     const input = document.getElementById("msg");
// // // // // // // //     const text = input.value.trim();
// // // // // // // //     if (!text) return;
// // // // // // // //     input.value = "";
// // // // // // // //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // // // // // // //     await addDoc(collection(db, "messages"), { sender: username, text: text, time: Date.now() });
// // // // // // // // };

// // // // // // // // // Enter key to send
// // // // // // // // document.getElementById("msg").addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // // // // // // // // Real-time Messages Listener
// // // // // // // // onSnapshot(query(collection(db, "messages"), orderBy("time", "desc"), limit(50)), (snap) => {
// // // // // // // //     snap.docChanges().forEach(change => {
// // // // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // // //         if (change.type === "added") {
// // // // // // // //             allMessages = allMessages.filter(m => !(m.isUploading && m.fileName === data.fileName));
// // // // // // // //             allMessages.push(data);
// // // // // // // //         }
// // // // // // // //     });
// // // // // // // //     renderMessages();
// // // // // // // // });

// // // // // // // // // Logout
// // // // // // // // window.logout = async () => {
// // // // // // // //     await updateStatus("offline");
// // // // // // // //     localStorage.clear();
// // // // // // // //     location.href = "index.html";
// // // // // // // // };
// // // // // // // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);
// // // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // // import { 
// // // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // // //   doc, setDoc, limit 
// // // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // // /* ================= 1. CONFIG & AUTH ================= */
// // // // // // // const firebaseConfig = {
// // // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // // //   projectId: "new-webchat",
// // // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // // //   messagingSenderId: "815354080113",
// // // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // // };
// // // // // // // const app = initializeApp(firebaseConfig);
// // // // // // // const db = getFirestore(app);

// // // // // // // const DRIVE_CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // // // // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';

// // // // // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // // // // const username = localStorage.getItem("username");
// // // // // // // if (!username) location.href = "index.html";

// // // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // // document.getElementById("chat-name").textContent = otherUser;

// // // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // // const otherStatusRef = doc(db, "status", otherUser);
// // // // // // // const messagesRef = collection(db, "messages");

// // // // // // // /* ================= 2. UTILS (LINKS & STATUS) ================= */
// // // // // // // // Sirf normal text ko clickable banane ke liye
// // // // // // // function linkify(text) {
// // // // // // //     if (!text) return "";
// // // // // // //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// // // // // // //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // // // // // // }

// // // // // // // // Smart Status Update
// // // // // // // const updateMyStatus = (state, isTyping = false) => {
// // // // // // //     setDoc(userStatusRef, { state, isTyping, last_changed: Date.now() }, { merge: true });
// // // // // // // };

// // // // // // // /* ================= 3. RENDER ENGINE ================= */
// // // // // // // let allMessages = []; 
// // // // // // // function renderMessages() {
// // // // // // //     const box = document.getElementById("messages");
// // // // // // //     const uniqueMap = new Map();
// // // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // // //     box.innerHTML = '';
// // // // // // //     sortedMsgs.forEach(m => {
// // // // // // //         const isMe = m.sender === username;
// // // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// // // // // // //         let content = '';

// // // // // // //         if (m.isUploading) {
// // // // // // //             content = `<div style="font-size:11px;">Uploading... ${m.progress}%</div>`;
// // // // // // //         } else if (m.driveId) {
// // // // // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // // // // //             content = `
// // // // // // //                 <div style="display:flex; align-items:center; gap:8px;">
// // // // // // //                     <i class="fas fa-file-video" style="color:#ff4757;"></i>
// // // // // // //                     <div style="text-align:left;">
// // // // // // //                         <div style="font-size:11px; font-weight:bold; max-width:130px; overflow:hidden;">${m.fileName}</div>
// // // // // // //                         <a href="${fileLink}" target="_blank" style="color:#34b7f1; font-size:12px;">View File ↗</a>
// // // // // // //                     </div>
// // // // // // //                 </div>`;
// // // // // // //         } else {
// // // // // // //             content = `<span>${linkify(m.text)}</span>`;
// // // // // // //         }

// // // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // // //                 <div class="msg-meta">${time}</div>
// // // // // // //             </div>`);
// // // // // // //     });
// // // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // // }

// // // // // // // /* ================= 4. REAL-TIME LISTENERS ================= */
// // // // // // // // Listen for Messages
// // // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // // // // // //     snap.docChanges().forEach(change => {
// // // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // // //         if (change.type === "added") {
// // // // // // //             allMessages = allMessages.filter(m => !(m.isUploading && m.fileName === data.fileName));
// // // // // // //             allMessages.push(data);
// // // // // // //         }
// // // // // // //     });
// // // // // // //     renderMessages();
// // // // // // // });

// // // // // // // // Listen for Other User (Online/Typing)
// // // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // // //     if (!snap.exists()) return;
// // // // // // //     const d = snap.data();
// // // // // // //     const statusEl = document.getElementById("user-status");
// // // // // // //     const typingInd = document.getElementById("typing-indicator");

// // // // // // //     // Instagram Dots logic
// // // // // // //     if (d.isTyping) typingInd.classList.remove("hidden");
// // // // // // //     else typingInd.classList.add("hidden");

// // // // // // //     // Last Seen logic
// // // // // // //     if (d.state === "online") {
// // // // // // //         statusEl.textContent = "Online";
// // // // // // //         statusEl.style.color = "#4cd137";
// // // // // // //     } else {
// // // // // // //         const lastSeen = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // //         statusEl.textContent = `Last seen at ${lastSeen}`;
// // // // // // //         statusEl.style.color = "#aaa";
// // // // // // //     }
// // // // // // // });

// // // // // // // /* ================= 5. USER ACTIONS ================= */
// // // // // // // const input = document.getElementById("msg");

// // // // // // // // Send Message
// // // // // // // window.sendMessage = async () => {
// // // // // // //     const text = input.value.trim();
// // // // // // //     if (!text) return;
// // // // // // //     input.value = "";
// // // // // // //     updateMyStatus("online", false);
// // // // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now() });
// // // // // // // };

// // // // // // // // Enter Key Support
// // // // // // // input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // // // // // // // Typing Detection
// // // // // // // let tTimer;
// // // // // // // input.addEventListener("input", () => {
// // // // // // //     updateMyStatus("online", true);
// // // // // // //     clearTimeout(tTimer);
// // // // // // //     tTimer = setTimeout(() => updateMyStatus("online", false), 2000);
// // // // // // // });

// // // // // // // // File Upload Logic
// // // // // // // const fileInput = document.getElementById("drive-upload");
// // // // // // // document.getElementById("attach-btn").onclick = () => fileInput.click();

// // // // // // // fileInput.onchange = async (e) => {
// // // // // // //     const file = e.target.files[0];
// // // // // // //     if (!file || !driveToken) return;

// // // // // // //     const tempId = "temp-" + Date.now();
// // // // // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 1, fileName: file.name, time: Date.now() });
// // // // // // //     renderMessages();

// // // // // // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // // // // //     const formData = new FormData();
// // // // // // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // // // // //     formData.append('file', file);

// // // // // // //     const xhr = new XMLHttpRequest();
// // // // // // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // // // // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // // // // // //     xhr.upload.onprogress = (ev) => {
// // // // // // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // // // // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // // // // //         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// // // // // // //     };

// // // // // // //     xhr.onload = async () => {
// // // // // // //         if (xhr.status === 200) {
// // // // // // //             const fid = JSON.parse(xhr.response).id;
// // // // // // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // // // // //                 method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // // // // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // // // // //             });
// // // // // // //             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now() });
// // // // // // //         }
// // // // // // //     };
// // // // // // //     xhr.send(formData);
// // // // // // // };

// // // // // // // /* ================= 6. LIFECYCLE ================= */
// // // // // // // // Smart Online/Offline based on Tab visibility
// // // // // // // document.addEventListener("visibilitychange", () => {
// // // // // // //     updateMyStatus(document.visibilityState === 'visible' ? "online" : "offline");
// // // // // // // });

// // // // // // // // Initial Online
// // // // // // // updateMyStatus("online");

// // // // // // // // Logout
// // // // // // // window.logout = async () => {
// // // // // // //     await updateMyStatus("offline");
// // // // // // //     localStorage.clear();
// // // // // // //     location.href = "index.html";
// // // // // // // };
// // // // // // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);
// // // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // // import { 
// // // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // // //   doc, setDoc, limit, where, getDocs, writeBatch 
// // // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // // /* ================= 1. CONFIG & AUTH ================= */
// // // // // // const firebaseConfig = {
// // // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // // //   projectId: "new-webchat",
// // // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // // //   messagingSenderId: "815354080113",
// // // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // // };
// // // // // // const app = initializeApp(firebaseConfig);
// // // // // // const db = getFirestore(app);

// // // // // // const username = localStorage.getItem("username");
// // // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // // if (!username) location.href = "index.html";

// // // // // // document.getElementById("chat-name").textContent = otherUser;
// // // // // // const userStatusRef = doc(db, "status", username);
// // // // // // const otherStatusRef = doc(db, "status", otherUser);
// // // // // // const messagesRef = collection(db, "messages");

// // // // // // /* ================= 2. UTILS & LINKIFY ================= */
// // // // // // function linkify(text) {
// // // // // //     if (!text) return "";
// // // // // //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// // // // // //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // // // // // }

// // // // // // // Mark messages as seen when I'm looking at the chat
// // // // // // const markAsSeen = async () => {
// // // // // //     const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
// // // // // //     const snap = await getDocs(q);
// // // // // //     const batch = writeBatch(db);
// // // // // //     snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
// // // // // //     await batch.commit();
// // // // // // };

// // // // // // /* ================= 3. RENDER ENGINE ================= */
// // // // // // let allMessages = []; 
// // // // // // function renderMessages() {
// // // // // //     const box = document.getElementById("messages");
// // // // // //     const uniqueMap = new Map();
// // // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // // //     box.innerHTML = '';
// // // // // //     sortedMsgs.forEach(m => {
// // // // // //         const isMe = m.sender === username;
// // // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        
// // // // // //         // Status Text (Seen/Sent) logic
// // // // // //         let statusText = "";
// // // // // //         if (isMe) {
// // // // // //             statusText = m.seen ? `<span class="status-seen">Seen</span>` : `<span class="status-sent">Sent</span>`;
// // // // // //         }

// // // // // //         let content = m.driveId ? 
// // // // // //             `<div class="file-box"><a href="https://drive.google.com/file/d/${m.driveId}/view" target="_blank">View File ↗</a></div>` : 
// // // // // //             `<span>${linkify(m.text)}</span>`;

// // // // // //         box.insertAdjacentHTML("beforeend", `
// // // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // // //                 <div class="msg-meta">${time} ${statusText}</div>
// // // // // //             </div>`);
// // // // // //     });
// // // // // //     box.scrollTop = box.scrollHeight;
// // // // // // }

// // // // // // /* ================= 4. REAL-TIME SYNC ================= */
// // // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // // // // //     let newMsgFromOther = false;
// // // // // //     snap.docChanges().forEach(change => {
// // // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // // //         const idx = allMessages.findIndex(m => m.id === data.id);
// // // // // //         if (idx > -1) allMessages[idx] = data;
// // // // // //         else allMessages.push(data);
        
// // // // // //         if (data.sender === otherUser && !data.seen) newMsgFromOther = true;
// // // // // //     });
    
// // // // // //     if (newMsgFromOther && document.visibilityState === 'visible') markAsSeen();
// // // // // //     renderMessages();
// // // // // // });

// // // // // // // Status & Typing Listeners
// // // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // // //     if (!snap.exists()) return;
// // // // // //     const d = snap.data();
// // // // // //     const statusEl = document.getElementById("user-status");
// // // // // //     const typingInd = document.getElementById("typing-indicator");

// // // // // //     if (d.isTyping) typingInd.classList.remove("hidden");
// // // // // //     else typingInd.classList.add("hidden");

// // // // // //     if (d.state === "online") {
// // // // // //         statusEl.textContent = "Online";
// // // // // //         statusEl.style.color = "#4cd137";
// // // // // //     } else {
// // // // // //         const ls = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // //         statusEl.textContent = `Last seen at ${ls}`;
// // // // // //         statusEl.style.color = "#aaa";
// // // // // //     }
// // // // // // });

// // // // // // /* ================= 5. USER ACTIONS ================= */
// // // // // // const input = document.getElementById("msg");

// // // // // // window.sendMessage = async () => {
// // // // // //     const text = input.value.trim();
// // // // // //     if (!text) return;
// // // // // //     input.value = "";
// // // // // //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // // // // // };

// // // // // // // Enter key support
// // // // // // input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // // // // // // Typing status
// // // // // // let tTimer;
// // // // // // input.addEventListener("input", () => {
// // // // // //     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
// // // // // //     clearTimeout(tTimer);
// // // // // //     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// // // // // // });

// // // // // // // Smart Online/Offline logic
// // // // // // document.addEventListener("visibilitychange", () => {
// // // // // //     const s = document.visibilityState === 'visible' ? "online" : "offline";
// // // // // //     setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
// // // // // //     if (s === "online") markAsSeen();
// // // // // // });

// // // // // // // Initial load
// // // // // // setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });
// // // // // // markAsSeen();

// // // // // // // Attach Button logic
// // // // // // const fileInput = document.getElementById("drive-upload");
// // // // // // document.getElementById("attach-btn").onclick = () => fileInput.click();
// // // // // // // ... (Drive upload logic same as before) ...
// // // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // // import { 
// // // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // // //   doc, setDoc, limit, where, getDocs, writeBatch 
// // // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // // /* ================= 1. CONFIG & AUTH ================= */
// // // // // const firebaseConfig = {
// // // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // // //   authDomain: "new-webchat.firebaseapp.com",
// // // // //   projectId: "new-webchat",
// // // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // // //   messagingSenderId: "815354080113",
// // // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // // };
// // // // // const app = initializeApp(firebaseConfig);
// // // // // const db = getFirestore(app);

// // // // // const username = localStorage.getItem("username");
// // // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // // // // if (!username) location.href = "index.html";

// // // // // document.getElementById("chat-name").textContent = otherUser;
// // // // // const userStatusRef = doc(db, "status", username);
// // // // // const otherStatusRef = doc(db, "status", otherUser);
// // // // // const messagesRef = collection(db, "messages");

// // // // // /* ================= 2. HELPERS (LINKS & SEEN) ================= */
// // // // // function linkify(text) {
// // // // //     if (!text) return "";
// // // // //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// // // // //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // // // // }

// // // // // const markAsSeen = async () => {
// // // // //     const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
// // // // //     const snap = await getDocs(q);
// // // // //     const batch = writeBatch(db);
// // // // //     snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
// // // // //     await batch.commit();
// // // // // };

// // // // // /* ================= 3. RENDER ENGINE ================= */
// // // // // let allMessages = []; 
// // // // // function renderMessages() {
// // // // //     const box = document.getElementById("messages");
// // // // //     const uniqueMap = new Map();
// // // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // // //     box.innerHTML = '';
// // // // //     sortedMsgs.forEach(m => {
// // // // //         const isMe = m.sender === username;
// // // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        
// // // // //         let statusText = "";
// // // // //         if (isMe) {
// // // // //             statusText = m.seen ? `<span style="color:#34b7f1; font-size:9px; margin-left:5px; font-weight:bold;">Seen</span>` 
// // // // //                                : `<span style="color:#aaa; font-size:9px; margin-left:5px;">Sent</span>`;
// // // // //         }

// // // // //         let content = m.driveId ? 
// // // // //             `<div class="file-link-bubble"><a href="https://drive.google.com/file/d/${m.driveId}/view" target="_blank" style="color:#34b7f1;">View File ↗</a></div>` : 
// // // // //             `<span>${linkify(m.text)}</span>`;

// // // // //         box.insertAdjacentHTML("beforeend", `
// // // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // // //                 <div class="msg-meta">${time} ${statusText}</div>
// // // // //             </div>`);
// // // // //     });
// // // // //     box.scrollTop = box.scrollHeight;
// // // // // }

// // // // // /* ================= 4. REAL-TIME SYNC ================= */
// // // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // // // //     let hasNew = false;
// // // // //     snap.docChanges().forEach(change => {
// // // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // // //         const idx = allMessages.findIndex(m => m.id === data.id);
// // // // //         if (idx > -1) allMessages[idx] = data;
// // // // //         else allMessages.push(data);
// // // // //         if (data.sender === otherUser && !data.seen) hasNew = true;
// // // // //     });
// // // // //     if (hasNew && document.visibilityState === 'visible') markAsSeen();
// // // // //     renderMessages();
// // // // // });

// // // // // onSnapshot(otherStatusRef, (snap) => {
// // // // //     if (!snap.exists()) return;
// // // // //     const d = snap.data();
// // // // //     const statusEl = document.getElementById("user-status");
// // // // //     const typingInd = document.getElementById("typing-indicator");

// // // // //     if (d.isTyping) typingInd.classList.remove("hidden");
// // // // //     else typingInd.classList.add("hidden");

// // // // //     if (d.state === "online") {
// // // // //         statusEl.textContent = "Online";
// // // // //         statusEl.style.color = "#4cd137";
// // // // //     } else {
// // // // //         const ls = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // //         statusEl.textContent = `Last seen at ${ls}`;
// // // // //         statusEl.style.color = "#aaa";
// // // // //     }
// // // // // });

// // // // // /* ================= 5. USER ACTIONS ================= */
// // // // // const input = document.getElementById("msg");

// // // // // window.sendMessage = async () => {
// // // // //     const text = input.value.trim();
// // // // //     if (!text) return;
// // // // //     input.value = "";
// // // // //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // // // // };

// // // // // input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // // // // let tTimer;
// // // // // input.addEventListener("input", () => {
// // // // //     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
// // // // //     clearTimeout(tTimer);
// // // // //     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// // // // // });

// // // // // /* ================= 6. LOGOUT & STATUS ================= */
// // // // // window.logout = async () => {
// // // // //     await setDoc(userStatusRef, { state: "offline", last_changed: Date.now() }, { merge: true });
// // // // //     localStorage.clear();
// // // // //     location.href = "index.html";
// // // // // };

// // // // // // Logout button par listener lagao (apni HTML class check kar lena)
// // // // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);

// // // // // document.addEventListener("visibilitychange", () => {
// // // // //     const s = document.visibilityState === 'visible' ? "online" : "offline";
// // // // //     setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
// // // // //     if (s === "online") markAsSeen();
// // // // // });

// // // // // // Start-up
// // // // // setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });
// // // // // markAsSeen();

// // // // // document.getElementById("attach-btn").onclick = () => document.getElementById("drive-upload").click();
// // // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // // import { 
// // // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // // //   doc, setDoc, limit, where, getDocs, writeBatch 
// // // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // // /* ================= 1. CONFIG & AUTH ================= */
// // // // const firebaseConfig = {
// // // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // // //   authDomain: "new-webchat.firebaseapp.com",
// // // //   projectId: "new-webchat",
// // // //   storageBucket: "new-webchat.firebasestorage.app",
// // // //   messagingSenderId: "815354080113",
// // // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // // };
// // // // const app = initializeApp(firebaseConfig);
// // // // const db = getFirestore(app);

// // // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';
// // // // let driveToken = localStorage.getItem('drive_token') || '';
// // // // const username = localStorage.getItem("username");
// // // // const otherUser = username === "pratham" ? "Adhya" : "pratham";

// // // // if (!username) location.href = "index.html";
// // // // document.getElementById("chat-name").textContent = otherUser;

// // // // const userStatusRef = doc(db, "status", username);
// // // // const otherStatusRef = doc(db, "status", otherUser);
// // // // const messagesRef = collection(db, "messages");

// // // // /* ================= 2. HELPERS ================= */
// // // // // Sirf normal text links ko clickable banana
// // // // function linkify(text) {
// // // //     if (!text) return "";
// // // //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// // // //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // // // }

// // // // // Messages ko seen mark karna
// // // // const markAsSeen = async () => {
// // // //     const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
// // // //     const snap = await getDocs(q);
// // // //     const batch = writeBatch(db);
// // // //     snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
// // // //     await batch.commit();
// // // // };

// // // // /* ================= 3. RENDER ENGINE ================= */
// // // // let allMessages = []; 
// // // // function renderMessages() {
// // // //     const box = document.getElementById("messages");
// // // //     const uniqueMap = new Map();
// // // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // // //     box.innerHTML = '';
// // // //     sortedMsgs.forEach(m => {
// // // //         const isMe = m.sender === username;
// // // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        
// // // //         let statusText = "";
// // // //         if (isMe) {
// // // //             statusText = m.seen ? `<span style="color:#34b7f1; font-size:9px; margin-left:5px; font-weight:bold;">Seen</span>` 
// // // //                                : `<span style="color:#aaa; font-size:9px; margin-left:5px;">Sent</span>`;
// // // //         }

// // // //         let content = '';
// // // //         if (m.isUploading) {
// // // //             content = `<div style="font-size:11px;">Uploading... ${m.progress}%</div>`;
// // // //         } else if (m.driveId) {
// // // //             const fileLink = `https://drive.google.com/file/d/${m.driveId}/view?usp=sharing`;
// // // //             content = `<div class="file-link-bubble"><a href="${fileLink}" target="_blank" style="color:#34b7f1; font-weight:bold; text-decoration:none;">View File ↗</a></div>`;
// // // //         } else {
// // // //             content = `<span>${linkify(m.text)}</span>`;
// // // //         }

// // // //         box.insertAdjacentHTML("beforeend", `
// // // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // // //                 <div class="msg-meta">${time} ${statusText}</div>
// // // //             </div>`);
// // // //     });
// // // //     box.scrollTop = box.scrollHeight;
// // // // }

// // // // /* ================= 4. REAL-TIME SYNC ================= */
// // // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // // //     let hasNew = false;
// // // //     snap.docChanges().forEach(change => {
// // // //         const data = { id: change.doc.id, ...change.doc.data() };
// // // //         const idx = allMessages.findIndex(m => m.id === data.id);
// // // //         if (idx > -1) allMessages[idx] = data;
// // // //         else allMessages.push(data);
// // // //         if (data.sender === otherUser && !data.seen) hasNew = true;
// // // //     });
// // // //     if (hasNew && document.visibilityState === 'visible') markAsSeen();
// // // //     renderMessages();
// // // // });

// // // // onSnapshot(otherStatusRef, (snap) => {
// // // //     if (!snap.exists()) return;
// // // //     const d = snap.data();
// // // //     const statusEl = document.getElementById("user-status");
// // // //     const typingInd = document.getElementById("typing-indicator");

// // // //     if (d.isTyping) typingInd.classList.remove("hidden");
// // // //     else typingInd.classList.add("hidden");

// // // //     if (d.state === "online") {
// // // //         statusEl.textContent = "Online";
// // // //         statusEl.style.color = "#4cd137";
// // // //     } else {
// // // //         const ls = new Date(d.last_changed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // //         statusEl.textContent = `Last seen at ${ls}`;
// // // //         statusEl.style.color = "#aaa";
// // // //     }
// // // // });

// // // // /* ================= 5. USER ACTIONS ================= */
// // // // const input = document.getElementById("msg");

// // // // window.sendMessage = async () => {
// // // //     const text = input.value.trim();
// // // //     if (!text) return;
// // // //     input.value = "";
// // // //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // // //     await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // // // };

// // // // // Hit Enter to Send
// // // // input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // // // // Typing Logic
// // // // let tTimer;
// // // // input.addEventListener("input", () => {
// // // //     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
// // // //     clearTimeout(tTimer);
// // // //     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// // // // });

// // // // // File Upload
// // // // const fileInput = document.getElementById("drive-upload");
// // // // document.getElementById("attach-btn").onclick = () => fileInput.click();

// // // // fileInput.onchange = async (e) => {
// // // //     const file = e.target.files[0];
// // // //     if (!file || !driveToken) return;

// // // //     const tempId = "temp-" + Date.now();
// // // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 1, fileName: file.name, time: Date.now() });
// // // //     renderMessages();

// // // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // // //     const formData = new FormData();
// // // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // // //     formData.append('file', file);

// // // //     const xhr = new XMLHttpRequest();
// // // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // // //     xhr.upload.onprogress = (ev) => {
// // // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // // //         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// // // //     };

// // // //     xhr.onload = async () => {
// // // //         if (xhr.status === 200) {
// // // //             const fid = JSON.parse(xhr.response).id;
// // // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // // //                 method: 'POST', headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // // //             });
// // // //             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now(), seen: false });
// // // //         }
// // // //     };
// // // //     xhr.send(formData);
// // // // };

// // // // /* ================= 6. LIFECYCLE & LOGOUT ================= */
// // // // window.logout = async () => {
// // // //     await setDoc(userStatusRef, { state: "offline", last_changed: Date.now() }, { merge: true });
// // // //     localStorage.clear();
// // // //     location.href = "index.html";
// // // // };
// // // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);

// // // // // Smart Online/Offline logic
// // // // document.addEventListener("visibilitychange", () => {
// // // //     const s = document.visibilityState === 'visible' ? "online" : "offline";
// // // //     setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
// // // //     if (s === "online") markAsSeen();
// // // // });

// // // // // Init
// // // // setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });
// // // // markAsSeen();
// // // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // // import { 
// // //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// // //   doc, setDoc, limit, where, getDocs, writeBatch 
// // // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // /* ================= 1. CONFIG ================= */
// // // const firebaseConfig = {
// // //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// // //   authDomain: "new-webchat.firebaseapp.com",
// // //   projectId: "new-webchat",
// // //   storageBucket: "new-webchat.firebasestorage.app",
// // //   messagingSenderId: "815354080113",
// // //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // // };
// // // const app = initializeApp(firebaseConfig);
// // // const db = getFirestore(app);

// // // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';
// // // // Drive token check
// // // let driveToken = localStorage.getItem('drive_token') || '';
// // // const username = localStorage.getItem("username");
// // // const otherUser = username === "pratham" ? "Adhya" : "pratham";

// // // if (!username) location.href = "index.html";
// // // document.getElementById("chat-name").textContent = otherUser;

// // // const userStatusRef = doc(db, "status", username);
// // // const otherStatusRef = doc(db, "status", otherUser);
// // // const messagesRef = collection(db, "messages");

// // // /* ================= 2. UTILS ================= */
// // // function linkify(text) {
// // //     if (!text) return "";
// // //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// // //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // // }

// // // const markAsSeen = async () => {
// // //     const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
// // //     const snap = await getDocs(q);
// // //     const batch = writeBatch(db);
// // //     snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
// // //     await batch.commit();
// // // };

// // // /* ================= 3. RENDER ================= */
// // // let allMessages = []; 
// // // function renderMessages() {
// // //     const box = document.getElementById("messages");
// // //     const uniqueMap = new Map();
// // //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// // //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// // //     box.innerHTML = '';
// // //     sortedMsgs.forEach(m => {
// // //         const isMe = m.sender === username;
// // //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        
// // //         let statusText = isMe ? (m.seen ? `<span style="color:#34b7f1; font-size:9px; font-weight:bold; margin-left:5px;">Seen</span>` : `<span style="color:#aaa; font-size:9px; margin-left:5px;">Sent</span>`) : "";

// // //         let content = '';
// // //         if (m.isUploading) {
// // //             content = `<div style="font-size:11px; color:#34b7f1;">Uploading: ${m.progress}%</div>`;
// // //         } else if (m.driveId) {
// // //             content = `<div class="file-link"><a href="https://drive.google.com/file/d/${m.driveId}/view" target="_blank" style="color:#34b7f1; font-weight:bold;">View File ↗</a></div>`;
// // //         } else {
// // //             content = `<span>${linkify(m.text)}</span>`;
// // //         }

// // //         box.insertAdjacentHTML("beforeend", `
// // //             <div class="msg-row ${isMe ? "me-row" : "other-row"}">
// // //                 <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
// // //                 <div class="msg-meta">${time} ${statusText}</div>
// // //             </div>`);
// // //     });
// // //     box.scrollTop = box.scrollHeight;
// // // }

// // // /* ================= 4. LISTENERS ================= */
// // // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// // //     let hasNew = false;
// // //     snap.docChanges().forEach(change => {
// // //         const data = { id: change.doc.id, ...change.doc.data() };
// // //         const idx = allMessages.findIndex(m => m.id === data.id);
// // //         if (idx > -1) allMessages[idx] = data;
// // //         else allMessages.push(data);
// // //         if (data.sender === otherUser && !data.seen) hasNew = true;
// // //     });
// // //     if (hasNew && document.visibilityState === 'visible') markAsSeen();
// // //     renderMessages();
// // // });

// // // onSnapshot(otherStatusRef, (snap) => {
// // //     if (!snap.exists()) return;
// // //     const d = snap.data();
// // //     const statusEl = document.getElementById("user-status");
// // //     const typingInd = document.getElementById("typing-indicator");
// // //     if (d.isTyping) typingInd.classList.remove("hidden"); else typingInd.classList.add("hidden");
// // //     if (d.state === "online") { statusEl.textContent = "Online"; statusEl.style.color = "#4cd137"; }
// // //     else { statusEl.textContent = `Last seen at ${new Date(d.last_changed).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`; statusEl.style.color = "#aaa"; }
// // // });

// // // /* ================= 5. CORE ACTIONS ================= */
// // // const input = document.getElementById("msg");

// // // window.sendMessage = async () => {
// // //     const text = input.value.trim();
// // //     if (!text) return;
// // //     input.value = "";
// // //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// // //     await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // // };

// // // input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // // let tTimer;
// // // input.addEventListener("input", () => {
// // //     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
// // //     clearTimeout(tTimer);
// // //     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// // // });

// // // /* ================= 6. FILE UPLOAD (FIXED) ================= */
// // // const fileInput = document.getElementById("drive-upload");
// // // document.getElementById("attach-btn").onclick = () => fileInput.click();

// // // fileInput.onchange = async (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file) return;

// // //     // Check if token is present
// // //     if (!driveToken) {
// // //         console.error("Drive Token Missing!");
// // //         alert("Session expired. Please login again to share files.");
// // //         return;
// // //     }

// // //     const tempId = "temp-" + Date.now();
// // //     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, fileName: file.name, time: Date.now() });
// // //     renderMessages();

// // //     const metadata = { name: file.name, parents: [FOLDER_ID] };
// // //     const formData = new FormData();
// // //     formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
// // //     formData.append('file', file);

// // //     const xhr = new XMLHttpRequest();
// // //     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// // //     xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
    
// // //     xhr.upload.onprogress = (ev) => {
// // //         const p = Math.round((ev.loaded / ev.total) * 100);
// // //         const idx = allMessages.findIndex(m => m.id === tempId);
// // //         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// // //     };

// // //     xhr.onload = async () => {
// // //         if (xhr.status === 200) {
// // //             const fid = JSON.parse(xhr.response).id;
// // //             // Set Public Permission so Adhya can see
// // //             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// // //                 method: 'POST', 
// // //                 headers: { 'Authorization': 'Bearer ' + driveToken, 'Content-Type': 'application/json' },
// // //                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
// // //             });
// // //             // Final Message in Firebase
// // //             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now(), seen: false });
// // //         } else {
// // //             console.error("Upload Error:", xhr.status, xhr.response);
// // //             alert("Upload failed. Make sure your GDrive account is linked.");
// // //             allMessages = allMessages.filter(m => m.id !== tempId);
// // //             renderMessages();
// // //         }
// // //     };

// // //     xhr.onerror = () => {
// // //         alert("Network error during upload.");
// // //     };

// // //     xhr.send(formData);
// // // };

// // // /* ================= 7. LIFECYCLE ================= */
// // // window.logout = async () => {
// // //     await setDoc(userStatusRef, { state: "offline", last_changed: Date.now() }, { merge: true });
// // //     localStorage.clear();
// // //     location.href = "index.html";
// // // };
// // // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);

// // // document.addEventListener("visibilitychange", () => {
// // //     const s = document.visibilityState === 'visible' ? "online" : "offline";
// // //     setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
// // //     if (s === "online") markAsSeen();
// // // });

// // // setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });
// // // markAsSeen();
// // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // import { 
// //   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
// //   doc, setDoc, limit, where, getDocs, writeBatch 
// // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // /* ================= 1. CONFIG & AUTH ================= */
// // const firebaseConfig = {
// //   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
// //   authDomain: "new-webchat.firebaseapp.com",
// //   projectId: "new-webchat",
// //   storageBucket: "new-webchat.firebasestorage.app",
// //   messagingSenderId: "815354080113",
// //   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// // };
// // const app = initializeApp(firebaseConfig);
// // const db = getFirestore(app);

// // const CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// // const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';
// // const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// // const username = localStorage.getItem("username");
// // const otherUser = username === "pratham" ? "Adhya" : "pratham";
// // if (!username) location.href = "index.html";

// // document.getElementById("chat-name").textContent = otherUser;
// // const userStatusRef = doc(db, "status", username);
// // const otherStatusRef = doc(db, "status", otherUser);
// // const messagesRef = collection(db, "messages");

// // /* ================= 2. GDRIVE AUTH (FIXED) ================= */
// // let tokenClient;

// // function getNewToken(callback) {
// //     if (typeof google === 'undefined') {
// //         alert("Google Library is still loading... Please try again in 2 seconds.");
// //         return;
// //     }
// //     tokenClient = google.accounts.oauth2.initTokenClient({
// //         client_id: CLIENT_ID,
// //         scope: SCOPES,
// //         callback: (response) => {
// //             if (response.access_token) {
// //                 localStorage.setItem('drive_token', response.access_token);
// //                 if (callback) callback(response.access_token);
// //             }
// //         },
// //     });
// //     tokenClient.requestAccessToken();
// // }

// // /* ================= 3. UTILS & RENDER ================= */
// // function linkify(text) {
// //     if (!text) return "";
// //     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
// //     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// // }

// // const markAsSeen = async () => {
// //     const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
// //     const snap = await getDocs(q);
// //     const batch = writeBatch(db);
// //     snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
// //     await batch.commit();
// // };

// // let allMessages = []; 
// // function renderMessages() {
// //     const box = document.getElementById("messages");
// //     const uniqueMap = new Map();
// //     allMessages.forEach(m => uniqueMap.set(m.id, m));
// //     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

// //     box.innerHTML = '';
// //     sortedMsgs.forEach(m => {
// //         const isMe = m.sender === username;
// //         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //         let statusTxt = isMe ? (m.seen ? `<span style="color:#34b7f1; font-weight:bold; font-size:9px; margin-left:5px;">Seen</span>` : `<span style="color:#aaa; font-size:9px; margin-left:5px;">Sent</span>`) : "";

// //         let content = m.isUploading ? `<div style="font-size:11px;">Uploading... ${m.progress}%</div>` :
// //                       m.driveId ? `<div class="file-box"><a href="https://drive.google.com/file/d/${m.driveId}/view" target="_blank" style="color:#34b7f1; font-weight:bold;">View File ↗</a></div>` :
// //                       `<span>${linkify(m.text)}</span>`;

// //         box.insertAdjacentHTML("beforeend", `<div class="msg-row ${isMe ? "me-row" : "other-row"}"><div class="bubble ${isMe ? "me" : "other"}">${content}</div><div class="msg-meta">${time} ${statusTxt}</div></div>`);
// //     });
// //     box.scrollTop = box.scrollHeight;
// // }

// // /* ================= 4. REAL-TIME LISTENERS ================= */
// // onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
// //     let hasNew = false;
// //     snap.docChanges().forEach(change => {
// //         const data = { id: change.doc.id, ...change.doc.data() };
// //         const idx = allMessages.findIndex(m => m.id === data.id);
// //         if (idx > -1) allMessages[idx] = data; else allMessages.push(data);
// //         if (data.sender === otherUser && !data.seen) hasNew = true;
// //     });
// //     if (hasNew && document.visibilityState === 'visible') markAsSeen();
// //     renderMessages();
// // });

// // onSnapshot(otherStatusRef, (snap) => {
// //     if (!snap.exists()) return;
// //     const d = snap.data();
// //     const statusEl = document.getElementById("user-status");
// //     const typingInd = document.getElementById("typing-indicator");
// //     if (d.isTyping) typingInd.classList.remove("hidden"); else typingInd.classList.add("hidden");
// //     if (d.state === "online") { statusEl.textContent = "Online"; statusEl.style.color = "#4cd137"; }
// //     else { statusEl.textContent = `Last seen at ${new Date(d.last_changed).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`; statusEl.style.color = "#aaa"; }
// // });

// // /* ================= 5. CORE ACTIONS ================= */
// // const input = document.getElementById("msg");
// // window.sendMessage = async () => {
// //     const text = input.value.trim();
// //     if (!text) return;
// //     input.value = "";
// //     setDoc(userStatusRef, { isTyping: false }, { merge: true });
// //     await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// // };
// // input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// // let tTimer;
// // input.addEventListener("input", () => {
// //     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
// //     clearTimeout(tTimer);
// //     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// // });

// // /* ================= 6. UPLOAD LOGIC ================= */
// // const fileInput = document.getElementById("drive-upload");
// // document.getElementById("attach-btn").onclick = () => fileInput.click();

// // fileInput.onchange = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const currentToken = localStorage.getItem('drive_token');
    
// //     const performUpload = (token) => {
// //         const tempId = "temp-" + Date.now();
// //         allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, fileName: file.name, time: Date.now() });
// //         renderMessages();

// //         const formData = new FormData();
// //         formData.append('metadata', new Blob([JSON.stringify({ name: file.name, parents: [FOLDER_ID] })], { type: 'application/json' }));
// //         formData.append('file', file);

// //         const xhr = new XMLHttpRequest();
// //         xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// //         xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        
// //         xhr.upload.onprogress = (ev) => {
// //             const p = Math.round((ev.loaded / ev.total) * 100);
// //             const idx = allMessages.findIndex(m => m.id === tempId);
// //             if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
// //         };

// //         xhr.onload = async () => {
// //             if (xhr.status === 401) { 
// //                 allMessages = allMessages.filter(m => m.id !== tempId);
// //                 renderMessages();
// //                 getNewToken((newToken) => performUpload(newToken)); 
// //             } else if (xhr.status === 200) {
// //                 const fid = JSON.parse(xhr.response).id;
// //                 await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
// //                     method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
// //                     body: JSON.stringify({ role: 'reader', type: 'anyone' })
// //                 });
// //                 await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now(), seen: false });
// //             }
// //         };
// //         xhr.send(formData);
// //     };

// //     if (!currentToken) getNewToken((t) => performUpload(t));
// //     else performUpload(currentToken);
// // };

// // /* ================= 7. LIFECYCLE & LOGOUT ================= */
// // window.logout = async () => {
// //     await setDoc(userStatusRef, { state: "offline", last_changed: Date.now() }, { merge: true });
// //     localStorage.clear();
// //     location.href = "index.html";
// // };
// // document.querySelector(".logout-btn")?.addEventListener("click", window.logout);

// // document.addEventListener("visibilitychange", () => {
// //     const s = document.visibilityState === 'visible' ? "online" : "offline";
// //     setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
// //     if (s === "online") markAsSeen();
// // });

// // setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });
// // markAsSeen();
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { 
//   getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
//   doc, setDoc, limit, where, getDocs, writeBatch 
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// /* ================= 1. CONFIG & AUTH ================= */
// const firebaseConfig = {
//   apiKey: "AIzaSyD4Jys3IDFC208G69auTbgTe0LkeIcauGI",
//   authDomain: "new-webchat.firebaseapp.com",
//   projectId: "new-webchat",
//   storageBucket: "new-webchat.firebasestorage.app",
//   messagingSenderId: "815354080113",
//   appId: "1:815354080113:web:f9b30bc1d1aee8655fe4d0"
// };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
// const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';
// const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// const username = localStorage.getItem("username");
// const otherUser = username === "pratham" ? "Adhya" : "pratham";
// if (!username) location.href = "index.html";

// document.getElementById("chat-name").textContent = otherUser;
// const userStatusRef = doc(db, "status", username);
// const otherStatusRef = doc(db, "status", otherUser);
// const messagesRef = collection(db, "messages");

// /* ================= 2. TOKEN & SESSION LOGIC ================= */
// let tokenClient;

// // Function to handle Google Auth
// function getNewToken(callback) {
//     if (typeof google === 'undefined') {
//         alert("Google Library loading... Please wait.");
//         return;
//     }
//     tokenClient = google.accounts.oauth2.initTokenClient({
//         client_id: CLIENT_ID,
//         scope: SCOPES,
//         callback: (response) => {
//             if (response.access_token) {
//                 localStorage.setItem('drive_token', response.access_token);
//                 localStorage.setItem('token_expiry', Date.now() + 3500 * 1000); // 1 hour approx
//                 if (callback) callback(response.access_token);
//             }
//         },
//     });
//     tokenClient.requestAccessToken();
// }

// // Check if token is still valid
// function isTokenValid() {
//     const token = localStorage.getItem('drive_token');
//     const expiry = localStorage.getItem('token_expiry');
//     return token && expiry && Date.now() < parseInt(expiry);
// }

// /* ================= 3. UI & RENDER ENGINE ================= */
// function linkify(text) {
//     if (!text) return "";
//     const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
//     return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
// }

// const markAsSeen = async () => {
//     const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
//     const snap = await getDocs(q);
//     const batch = writeBatch(db);
//     snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
//     await batch.commit();
// };

// let allMessages = []; 
// function renderMessages() {
//     const box = document.getElementById("messages");
//     const uniqueMap = new Map();
//     allMessages.forEach(m => uniqueMap.set(m.id, m));
//     const sortedMsgs = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);

//     box.innerHTML = '';
//     sortedMsgs.forEach(m => {
//         const isMe = m.sender === username;
//         const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//         let statusTxt = isMe ? (m.seen ? `<span style="color:#34b7f1; font-weight:bold; font-size:9px; margin-left:5px;">Seen</span>` : `<span style="color:#aaa; font-size:9px; margin-left:5px;">Sent</span>`) : "";

//         let content = m.isUploading ? `<div style="font-size:11px;">Uploading... ${m.progress}%</div>` :
//                       m.driveId ? `<div class="file-box"><a href="https://drive.google.com/file/d/${m.driveId}/view" target="_blank" style="color:#34b7f1; font-weight:bold;">View File ↗</a></div>` :
//                       `<span>${linkify(m.text)}</span>`;

//         box.insertAdjacentHTML("beforeend", `<div class="msg-row ${isMe ? "me-row" : "other-row"}"><div class="bubble ${isMe ? "me" : "other"}">${content}</div><div class="msg-meta">${time} ${statusTxt}</div></div>`);
//     });
//     box.scrollTop = box.scrollHeight;
// }

// /* ================= 4. REAL-TIME SYNC ================= */
// onSnapshot(query(messagesRef, orderBy("time", "desc"), limit(50)), (snap) => {
//     let hasNew = false;
//     snap.docChanges().forEach(change => {
//         const data = { id: change.doc.id, ...change.doc.data() };
//         const idx = allMessages.findIndex(m => m.id === data.id);
//         if (idx > -1) allMessages[idx] = data; else allMessages.push(data);
//         if (data.sender === otherUser && !data.seen) hasNew = true;
//     });
//     if (hasNew && document.visibilityState === 'visible') markAsSeen();
//     renderMessages();
// });

// onSnapshot(otherStatusRef, (snap) => {
//     if (!snap.exists()) return;
//     const d = snap.data();
//     const statusEl = document.getElementById("user-status");
//     const typingInd = document.getElementById("typing-indicator");
//     if (d.isTyping) typingInd.classList.remove("hidden"); else typingInd.classList.add("hidden");
//     if (d.state === "online") { statusEl.textContent = "Online"; statusEl.style.color = "#4cd137"; }
//     else { statusEl.textContent = `Last seen at ${new Date(d.last_changed).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`; statusEl.style.color = "#aaa"; }
// });

// /* ================= 5. MESSAGE ACTIONS ================= */
// const input = document.getElementById("msg");
// window.sendMessage = async () => {
//     const text = input.value.trim();
//     if (!text) return;
//     input.value = "";
//     setDoc(userStatusRef, { isTyping: false }, { merge: true });
//     await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
// };
// input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });

// let tTimer;
// input.addEventListener("input", () => {
//     setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
//     clearTimeout(tTimer);
//     tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
// });

// /* ================= 6. ATTACHMENT & UPLOAD LOGIC ================= */
// const fileInput = document.getElementById("drive-upload");

// // Attachment Button Logic: Check session first
// document.getElementById("attach-btn").onclick = () => {
//     if (isTokenValid()) {
//         fileInput.click();
//     } else {
//         // Token invalid or expired, re-authorize first
//         getNewToken(() => {
//             fileInput.click();
//         });
//     }
// };

// fileInput.onchange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const token = localStorage.getItem('drive_token');
//     const tempId = "temp-" + Date.now();
//     allMessages.push({ id: tempId, sender: username, isUploading: true, progress: 0, fileName: file.name, time: Date.now() });
//     renderMessages();

//     const formData = new FormData();
//     formData.append('metadata', new Blob([JSON.stringify({ name: file.name, parents: [FOLDER_ID] })], { type: 'application/json' }));
//     formData.append('file', file);

//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
//     xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    
//     xhr.upload.onprogress = (ev) => {
//         const p = Math.round((ev.loaded / ev.total) * 100);
//         const idx = allMessages.findIndex(m => m.id === tempId);
//         if(idx !== -1) { allMessages[idx].progress = p; renderMessages(); }
//     };

//     xhr.onload = async () => {
//         if (xhr.status === 200) {
//             const fid = JSON.parse(xhr.response).id;
//             await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
//                 method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ role: 'reader', type: 'anyone' })
//             });
//             await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now(), seen: false });
//         } else {
//             alert("Upload failed. Status: " + xhr.status);
//             allMessages = allMessages.filter(m => m.id !== tempId);
//             renderMessages();
//         }
//     };
//     xhr.send(formData);
// };

// /* ================= 7. STATUS & LIFECYCLE ================= */
// window.logout = async () => {
//     await setDoc(userStatusRef, { state: "offline", last_changed: Date.now() }, { merge: true });
//     localStorage.clear();
//     location.href = "index.html";
// };
// document.querySelector(".logout-btn")?.addEventListener("click", window.logout);

// document.addEventListener("visibilitychange", () => {
//     const s = document.visibilityState === 'visible' ? "online" : "offline";
//     setDoc(userStatusRef, { state: s, last_changed: Date.now() }, { merge: true });
//     if (s === "online") markAsSeen();
// });

// setDoc(userStatusRef, { state: "online", isTyping: false, last_changed: Date.now() }, { merge: true });
// markAsSeen();
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
  doc, setDoc, limit, where, getDocs, writeBatch 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= 1. CONFIG & AUTH ================= */
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

const CLIENT_ID = '918563414832-09j73bvrkp7k0tktfal7bnlk662cbj8s.apps.googleusercontent.com';
const FOLDER_ID = '10cAi9X_mR6jsOo38R8uGS25_OBunKNHM';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const username = localStorage.getItem("username");
const otherUser = username === "pratham" ? "Adhya" : "pratham";
if (!username) location.href = "index.html";

document.getElementById("chat-name").textContent = otherUser;
const userStatusRef = doc(db, "status", username);
const otherStatusRef = doc(db, "status", otherUser);
const messagesRef = collection(db, "messages");

/* ================= 2. TOKEN & SESSION LOGIC ================= */
let tokenClient;

function getNewToken(callback) {
    if (typeof google === 'undefined') {
        alert("Google Library loading... Please wait.");
        return;
    }
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.access_token) {
                localStorage.setItem('drive_token', response.access_token);
                localStorage.setItem('token_expiry', Date.now() + 3500 * 1000); 
                if (callback) callback(response.access_token);
            }
        },
    });
    tokenClient.requestAccessToken();
}

function isTokenValid() {
    const token = localStorage.getItem('drive_token');
    const expiry = localStorage.getItem('token_expiry');
    return token && expiry && Date.now() < parseInt(expiry);
}

/* ================= 3. UTILS & SMART RENDER (NO FLICKER) ================= */
function linkify(text) {
    if (!text) return "";
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: #34b7f1; text-decoration: underline;">$1</a>');
}

const markAsSeen = async () => {
    const q = query(messagesRef, where("sender", "==", otherUser), where("seen", "==", false));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.forEach((d) => batch.update(doc(db, "messages", d.id), { seen: true }));
    await batch.commit();
};

function appendOrUpdateMessage(m) {
    const box = document.getElementById("messages");
    let existingMsg = document.getElementById(`msg-${m.id}`);
    const isMe = m.sender === username;
    const time = new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    let statusTxt = isMe ? (m.seen ? `<span style="color:#34b7f1; font-weight:bold; font-size:9px; margin-left:5px;">Seen</span>` : `<span style="color:#aaa; font-size:9px; margin-left:5px;">Sent</span>`) : "";

    let content = m.isUploading ? `<div class="upload-info">Uploading... ${m.progress}%</div>` :
                  m.driveId ? `<div class="file-box"><a href="https://drive.google.com/file/d/${m.driveId}/view" target="_blank" style="color:#34b7f1; font-weight:bold; text-decoration:none;">View File ↗</a></div>` :
                  `<span>${linkify(m.text)}</span>`;

    const messageHTML = `
        <div class="bubble ${isMe ? "me" : "other"}">${content}</div>
        <div class="msg-meta">${time} ${statusTxt}</div>
    `;

    if (existingMsg) {
        if (existingMsg.innerHTML !== messageHTML) {
            existingMsg.innerHTML = messageHTML;
        }
    } else {
        const div = document.createElement("div");
        div.id = `msg-${m.id}`;
        div.className = `msg-row ${isMe ? "me-row" : "other-row"}`;
        div.innerHTML = messageHTML;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    }
}

/* ================= 4. REAL-TIME SYNC ================= */
onSnapshot(query(messagesRef, orderBy("time", "asc"), limit(50)), (snap) => {
    let hasNew = false;
    snap.docChanges().forEach(change => {
        const data = { id: change.doc.id, ...change.doc.data() };
        appendOrUpdateMessage(data);
        if (data.sender === otherUser && !data.seen) hasNew = true;
    });
    if (hasNew && document.visibilityState === 'visible') markAsSeen();
});

onSnapshot(otherStatusRef, (snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    const statusEl = document.getElementById("user-status");
    const typingInd = document.getElementById("typing-indicator");
    
    // Typing indicator logic
    if (d.isTyping) typingInd.classList.remove("hidden"); else typingInd.classList.add("hidden");
    
    // Online/Last Seen logic
    if (d.state === "online") { 
        statusEl.textContent = "Online"; 
        statusEl.style.color = "#4cd137"; 
    } else { 
        const lastSeenTime = new Date(d.last_changed).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        statusEl.textContent = `Last seen at ${lastSeenTime}`; 
        statusEl.style.color = "#aaa"; 
    }
});

/* ================= 5. MESSAGE ACTIONS ================= */
const input = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn"); 

window.sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    setDoc(userStatusRef, { isTyping: false }, { merge: true });
    await addDoc(messagesRef, { sender: username, text, time: Date.now(), seen: false });
};

input.addEventListener("keypress", (e) => { if(e.key === "Enter") window.sendMessage(); });
if(sendBtn) sendBtn.onclick = () => window.sendMessage();

let tTimer;
input.addEventListener("input", () => {
    setDoc(userStatusRef, { isTyping: true, state: "online", last_changed: Date.now() }, { merge: true });
    clearTimeout(tTimer);
    tTimer = setTimeout(() => setDoc(userStatusRef, { isTyping: false }, { merge: true }), 2000);
});

/* ================= 6. ATTACHMENT & UPLOAD ================= */
const fileInput = document.getElementById("drive-upload");
document.getElementById("attach-btn").onclick = () => {
    if (isTokenValid()) fileInput.click();
    else getNewToken(() => fileInput.click());
};

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('drive_token');
    const tempId = "temp-" + Date.now();
    
    appendOrUpdateMessage({ id: tempId, sender: username, isUploading: true, progress: 0, time: Date.now() });

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify({ name: file.name, parents: [FOLDER_ID] })], { type: 'application/json' }));
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    
    xhr.upload.onprogress = (ev) => {
        const p = Math.round((ev.loaded / ev.total) * 100);
        appendOrUpdateMessage({ id: tempId, sender: username, isUploading: true, progress: p, time: Date.now() });
    };

    xhr.onload = async () => {
        const tempEl = document.getElementById(`msg-${tempId}`);
        if (tempEl) tempEl.remove();

        if (xhr.status === 200) {
            const fid = JSON.parse(xhr.response).id;
            fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`, {
                method: 'POST', 
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'reader', type: 'anyone' })
            });
            await addDoc(messagesRef, { sender: username, driveId: fid, fileName: file.name, time: Date.now(), seen: false });
        } else {
            alert("Upload failed. Status: " + xhr.status);
        }
    };
    xhr.send(formData);
};

/* ================= 7. STATUS & LIFECYCLE (ONLINE/OFFLINE FIX) ================= */
// Function to update user status
const updateStatus = (state) => {
    setDoc(userStatusRef, { 
        state: state, 
        last_changed: Date.now(),
        isTyping: false 
    }, { merge: true });
};

window.logout = async () => {
    updateStatus("offline");
    localStorage.clear();
    location.href = "index.html";
};

// Jab tab change ho ya phone lock ho
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        updateStatus("online");
        markAsSeen();
    } else {
        updateStatus("offline");
    }
});

// Jab page close ho (tab band karna)
window.addEventListener("beforeunload", () => {
    updateStatus("offline");
});

// Initial load par online set karo
updateStatus("online");
markAsSeen();
