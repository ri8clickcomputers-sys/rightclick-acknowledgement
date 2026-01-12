alert("Script.js loaded");
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8uRXxvOyZeCUzPEt-pUytXj_R8N_JLww",
  authDomain: "rightclick-service-center.firebaseapp.com",
  projectId: "rightclick-service-center",
  storageBucket: "rightclick-service-center.firebasestorage.app",
  messagingSenderId: "558210394752",
  appId: "1:558210394752:web:a3f8663d7c6dc8cc88d465"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const customerName = document.getElementById("customerName").value.trim();
      const mobile = document.getElementById("mobile").value.trim();
      const item = document.getElementById("item").value;
      const problem = document.getElementById("problem").value.trim();
      const signature = document.getElementById("signature").value.trim();

      const accessories = {
        adapter: document.getElementById("accAdapter").checked,
        cable: document.getElementById("accCable").checked,
        hdmiVga: document.getElementById("accHdmiVga").checked,
        other: document.getElementById("accOther").value.trim()
      };

      const jobId = "RC-" + Date.now();

      await addDoc(collection(db, "jobs"), {
        jobId,
        customerName,
        mobile,
        item,
        accessories,
        problem,
        status: "Received",
        receivedDate: serverTimestamp(),
        signature
      });

      // Accessories string for print/WA
      let accList = [];
      if (accessories.adapter) accList.push("Adapter");
      if (accessories.cable) accList.push("Power Cable");
      if (accessories.hdmiVga) accList.push("HDMI/VGA Cable");
      if (accessories.other) accList.push(accessories.other);
      const accString = accList.length ? accList.join(", ") : "None";

      // Printable acknowledgement slip
      const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${jobId} - RightClick</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; line-height: 1.8; }
    h2 { text-align: center; color: #003366; }
    .label { font-weight: bold; }
    hr { margin: 30px 0; border: 1px solid #ccc; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <h2>RightClick Computer Sales & Service Center</h2>
  <p style="text-align:center;">Visakhapatnam<br>Contact: 9059895427</p>
  <hr>
  <h3>Customer Acknowledgement Receipt</h3>
  <p><span class="label">Job ID:</span> ${jobId}</p>
  <p><span class="label">Date:</span> ${new Date().toLocaleDateString('en-IN')}</p>
  <p><span class="label">Customer:</span> ${customerName}</p>
  <p><span class="label">Mobile:</span> ${mobile}</p>
  <p><span class="label">Item:</span> ${item}</p>
  <p><span class="label">Accessories:</span> ${accString}</p>
  <p><span class="label">Problem:</span> ${problem}</p>
  <p><span class="label">Received By:</span> ${signature}</p>
  <hr>
  <p><strong>Terms:</strong> Data backup is customer's responsibility. Quote Job ID for updates.</p>
  <div style="text-align:center; margin:40px 0;" class="no-print">
    <button onclick="window.print()" style="padding:15px 30px; font-size:18px; background:#003366; color:white; border:none; border-radius:8px;">Print Receipt</button>
  </div>
</body>
</html>`;
      const printWin = window.open('', '_blank');
      printWin.document.write(printContent);
      printWin.document.close();

      // WhatsApp to customer
      let customerNumber = mobile;
      if (!customerNumber.startsWith("91")) customerNumber = "91" + customerNumber;
      const waMessage = encodeURIComponent(
`RightClick Computer Sales & Service Center

Thank you ${customerName}!
Your ${item} has been received.

Job ID: ${jobId}
Problem: ${problem}

We will update you soon.`);
      window.open(`https://wa.me/${customerNumber}?text=${waMessage}`, "_blank");

      alert(`Success! Job ID: ${jobId}\nPrint the receipt from the new window.`);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Error saving job. Check internet/console.");
    }
  });
});
