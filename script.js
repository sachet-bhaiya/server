function edit(file = null, ext = null) {
    if (file) {
        const message = ext + file
    }
    else {
        const message = "sPeAk" + document.querySelector(".text").value;
    }
    fetch('/.netlify/functions/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent successfully:', data);
            if (data.status === 'success') {
                document.querySelector(".text").value = '';
            }
        })
        .catch(error => {
            console.log('Error occurred while sending the message:', error);
        });
}

function status() {
    requestAnimationFrame(status);
    fetch('/.netlify/functions/time')
        .then(response => response.json())
        .then(data => {
            fetch('/.netlify/functions/fetch')
                .then(res => res.json())
                .then(statusData => {
                    const prev = statusData.prevTime;
                    const end = data.endTime;
                    if (end - prev > 4 || (prev === 0 && end === 0)) {
                        document.querySelector(".status").textContent = "Offline";
                        document.querySelector(".status").style.color = "red";
                    } else {
                        document.querySelector(".status").textContent = "Online";
                        document.querySelector(".status").style.color = "green";
                    }
                });
        })
        .catch(error => console.log("Status fetch failed", error));
}

function readFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        fetch('/.netlify/functions/upload-file', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('fileName').textContent = `File uploaded successfully: ${file.name}`;
                } else {
                    console.log("File upload failed:", data.message);
                }
            })
            .catch(error => {
                console.log("Error uploading file:", error);
            });

        edit(document.getElementById('fileName').textContent, "pLaY")
        fileInput.value = "";
        document.getElementById('fileName').textContent = '';
    } else {
        console.log("No file selected.");
    }
}

document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        document.getElementById('fileName').textContent = `Selected File: ${file.name}`;
    } else {
        document.getElementById('fileName').textContent = '';
    }
});

function updateFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            edit(fileContent, "uPdAtE")
        };
        reader.readAsText(file);
    } else {
        console.log("No file selected.");
    }
}
function upload(){
    const fileInput = document.getElementById('audio-file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    // fetch('/upload', {
    //     method: 'POST',
    //     body: formData,
    // })
    // .then(response => response.json())
    // .then(data => alert(data.message))
    // .catch(error => console.error('Error:', error));
    const audioItem = document.createElement('div');
    audioItem.classList.add('audio-item');
    
    const trackName = document.createElement('span');
    trackName.textContent = document.getElementById('audio-file').files[0];
    
    const playButton = document.createElement('button');
    playButton.classList.add('play-btn');
    playButton.textContent = '▶';
    
    audioItem.appendChild(trackName);
    audioItem.appendChild(playButton);
    
    const audioList = document.getElementById('audio-list');
    audioList.appendChild(audioItem);
    document.getElementById('audio-file').files = null
}

// status();