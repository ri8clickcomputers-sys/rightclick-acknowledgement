import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8uRXxvOyZeCUzPEt-pUytXj_R8N_JLww",
  authDomain: "rightclick-service-center.firebaseapp.com",
  projectId: "rightclick-service-center",
  storageBucket: "rightclick-service-center.firebasestorage.app",
  messagingSenderId: "558210394752",
  appId: "1:558210394752:web:a3f8663d7c6dc8cc88d465"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle form submission
document.getElementById("jobForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const jobId = "RC-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

  const data = {
    jobId: jobId,
    customerName: document.getElementById("customerName").value,
    mobile: document.getElementById("mobile").value,
    item: document.getElementById("item").value,
    accessories: {
      adapter: document.getElementById("adapter").checked,
      power: document.getElementById("power").checked,
      hdmi: document.getElementById("hdmi").checked,
      mouse: document.getElementById("mouse").checked,
      keyboard: document.getElementById("keyboard").checked,
      other: document.getElementById("otherItems").value
    },
    problem: document.getElementById("problem").value,
    status: "Received",
    receivedDate: new Date(),
    signature: "RightClick Computer Sales & Service Center"
  };

  try {
    await addDoc(collection(db, "jobs"), data);
    alert("Acknowledgement generated successfully!\nJob ID: " + jobId);
    document.getElementById("jobForm").reset();
  } catch (error) {
    alert("Error saving data: " + error.message);
    console.error(error);
  }
});
