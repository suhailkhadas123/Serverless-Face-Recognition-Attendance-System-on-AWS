let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let statusText = document.getElementById("status");
let stream = null;
let token = "";


function getLoggedInUser() {
  const hash = window.location.hash;

  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  const idToken = params.get("id_token");

  if (!idToken) return null;

  const payload = JSON.parse(atob(idToken.split(".")[1]));

  
  return  payload["cognito:username"];
}
function showLoggedInUser() {
  const user = getLoggedInUser();
  if (user) {
    document.getElementById("getusername").innerText = user;
  }
}


// Start webcam
function onCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = stream;
    })
    .catch(() => alert("Camera access denied"));
}
// Stop webcam
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    statusText.innerText = "Camera stopped";
  }
}

// Capture image
function captureImage() {
  let context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// Upload image
function uploadImage() {
  canvas.toBlob(blob => {
    let formData = new FormData();
    formData.append("image", blob, "attendance.jpg");

    fetch("https://api-link", {
      method: "POST",
      
      body: blob
    })
    .then(res => res.text())
    .then(() => {
      statusText.innerText = "Attendance Marked Successfully";
      addAttendanceRow();
      stopCamera();

      // Close modal (Bootstrap)
      let modal = bootstrap.Modal.getInstance(
        document.getElementById("cameraModal")
      );
      modal.hide();
    })
    .catch(() => {
      statusText.innerText = "Upload Failed";
    });
  });
}

function addAttendanceRow() {
  let tableBody = document.getElementById("attendanceTableBody");
  if (!tableBody) return;

  let now = new Date();

  let date = now.toISOString().split("T")[0];
  let time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  let row = document.createElement("tr");
  row.innerHTML = `
    <td>${date}</td>
    <td>${time}</td>
    <td><span class="badge bg-success">Present</span></td>
  `;

  tableBody.prepend(row);
}

function loadAttendanceData() {
  const employeeId = getLoggedInUser();

  if (!employeeId) {
    console.error("User not logged in via Cognito");
    return;
  }

  fetch(`https://api-link/attendance?employeeId=${employeeId}`)
    .then(res => res.json())
    .then(data => {

      document.getElementById("totalAttendance").innerText = data.total;
      document.getElementById("presentToday").innerText = data.presentToday;
      
      document.getElementById("lastAttendance").innerText =
        data.lastAttendance
          ? new Date(data.lastAttendance).toLocaleTimeString()
          : "--";

      let container = document.getElementById("recentAttendance");
      container.innerHTML = "";

      data.records.forEach(item => {
        let div = document.createElement("div");
        div.className = "d-flex align-items-center gap-3 mb-2";
        div.innerHTML = `
          <span class="text-muted">
            ${new Date(item.timestamp).toLocaleString()}
          </span>
          <span class="badge bg-success rounded-pill">Present</span>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      console.log("Failed to load attendance data");
    });
}
