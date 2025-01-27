document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page");
    const navLinks = document.querySelectorAll(".nav-links a");
    const createAssessmentBtn = document.getElementById("create-assessment-btn");
    const modal = document.getElementById("create-assessment-modal");
    const closeModal = document.querySelector(".close-modal");
    const assessmentForm = document.getElementById("assessment-form");
    const assessmentList = document.getElementById("assessment-list");
    
    let assessments = [];
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("href").substring(1);
            pages.forEach(page => page.classList.remove("active"));
            document.getElementById(target).classList.add("active");
        });
    });

    // Show Create Assessment Modal
    createAssessmentBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modal.style.display = 'flex'; // Ensure modal is shown as a flex container
    });

    // Close Modal
    closeModal.addEventListener("click", () => {
        modal.style.display = 'none';
    });

    // Create Assessment
    assessmentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("assessment-name").value;
        const date = document.getElementById("assessment-date").value;
        const time = document.getElementById("assessment-time").value;
        const duration = document.getElementById("assessment-duration").value;

        const assessment = {
            id: Date.now(),
            name,
            date,
            time,
            duration,
            status: "Scheduled",
            timer: duration * 60,  // Convert minutes to seconds
            dishonestyReport: false,
            countdownInterval: null
        };

        assessments.push(assessment);
        renderAssessments();
        modal.style.display = 'none'; // Close modal after form submission
        assessmentForm.reset();
    });

    // Render Assessments
function renderAssessments() {
assessmentList.innerHTML = assessments.map(assessment => `
    <div class="assessment-item">
        <h3>${assessment.name}</h3>
        <p>Date: ${assessment.date} | Time: ${assessment.time} | Duration: ${assessment.duration} mins</p>
        ${assessment.status === "Scheduled" ? `
            <button onclick="startAssessment(${assessment.id})">Start Assessment</button>` : ''}
        ${assessment.status === "In Progress" ? `
            <button onclick="stopAssessment(${assessment.id})">Stop Assessment</button>` : ''}
        <button onclick="deleteAssessment(${assessment.id})">Delete</button>
        <button onclick="manageAssessment(${assessment.id})">Manage</button>
        ${assessment.timer > 0 ? `<p class="timer" id="timer-${assessment.id}">Time left: ${assessment.timer} seconds</p>` : ''}
    </div>
`).join("");
}

// Start Assessment


// Start Assessment
window.startAssessment = (id) => {
const assessment = assessments.find(a => a.id === id);
if (assessment && assessment.timer > 0) {
    alert(`Starting assessment: ${assessment.name}`);
    assessment.status = "In Progress";
    renderAssessments();

    // Send request to backend to start the screenshot process
    fetch('/start_assessment', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Assessment started.') {
            // Show stop button, hide start button
            document.getElementById("startButton").style.display = "none";
            document.getElementById("stopButton").style.display = "inline-block";
        } else {
            console.error('Error starting assessment:', data.message);
        }
    })
    .catch(err => console.log('Error:', err));

    startTimer(id);  // Start the timer for the assessment
}
};

// Stop Assessment
window.stopAssessment = () => {
fetch('/stop_assessment', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Assessment stopped.') {
            // Hide stop button and show start button again
            document.getElementById("startButton").style.display = "inline-block";
            document.getElementById("stopButton").style.display = "none";
            alert("Assessment stopped and screenshots capturing stopped.");
        } else {
            alert('Error stopping assessment');
        }
    })
    .catch(err => console.log('Error:', err));
};




////////////////////////










/*/ Start Assessment function
function startAssessment() {
        fetch('/start_assessment', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);  // Show success message in console
            // Hide the start button and show stop button
            document.getElementById('start-assessment-btn').style.display = 'none';
            document.getElementById('stop-assessment-btn').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    }

    // Stop Assessment function
    function stopAssessment() {
        fetch('/stop_assessment', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);  // Show success message in console
            // Hide the stop button and show start button
            document.getElementById('stop-assessment-btn').style.display = 'none';
            document.getElementById('start-assessment-btn').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    }
*/




















    // Timer Countdown
    function startTimer(id) {
        const assessment = assessments.find(a => a.id === id);
        const timerElement = document.getElementById(`timer-${id}`);
        if (assessment && timerElement) {
            assessment.countdownInterval = setInterval(() => {
                if (assessment.timer > 0) {
                    assessment.timer--;
                    timerElement.textContent = `Time left: ${assessment.timer} seconds`;
                } else {
                    clearInterval(assessment.countdownInterval);
                    assessment.status = "Completed";
                    renderAssessments();
                }
            }, 1000);
        }
    }

    // Stop Assessment
    window.stopAssessment = (id) => {
        const assessment = assessments.find(a => a.id === id);
        if (assessment) {
            clearInterval(assessment.countdownInterval);
            assessment.status = "Stopped";
            assessment.timer = 0;  // Stop the timer
            renderAssessments();
            alert(`Assessment stopped: ${assessment.name}`);
        }
    };

    // Delete Assessment
    window.deleteAssessment = (id) => {
        assessments = assessments.filter(a => a.id !== id);
        renderAssessments();
    };

    // Manage Assessment
    window.manageAssessment = (id) => {
        const assessment = assessments.find(a => a.id === id);
        if (assessment) {
            // Pre-fill the form fields with the current assessment data
            document.getElementById('assessmentName').value = assessment.name;
            document.getElementById('assessmentDate').value = assessment.date;
            document.getElementById('assessmentTime').value = assessment.time;
            document.getElementById('assessmentDuration').value = assessment.duration;

            // Show the modal
            document.getElementById('editModal').style.display = "block";

            // Save changes when "Save Changes" button is clicked
            document.getElementById('saveChanges').onclick = () => {
                const newName = document.getElementById('assessmentName').value;
                const newDate = document.getElementById('assessmentDate').value;
                const newTime = document.getElementById('assessmentTime').value;
                const newDuration = document.getElementById('assessmentDuration').value;

                if (newName && newDate && newTime && newDuration) {
                    assessment.name = newName;
                    assessment.date = newDate;
                    assessment.time = newTime;
                    assessment.duration = newDuration;
                    renderAssessments();
                    document.getElementById('editModal').style.display = "none";
                }
            };

            // Close modal when "Cancel" button is clicked
            document.getElementById('closeModal').onclick = () => {
                document.getElementById('editModal').style.display = "none";
            };
        }
    };
});