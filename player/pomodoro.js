const workTime = 50 * 60; // 50 minutes in seconds
const shortBreakTime = 5 * 60; // 5 minutes in seconds
const longBreakTime = 20 * 60; // 20 minutes in seconds
let isWorkPeriod = true;
let interval;
let pomodoroCount = 0; // Track number of completed Pomodoros

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const dots = document.querySelectorAll('.dot');
const brownNoise = document.getElementById('brownNoise');
const notificationSound = document.getElementById('notificationSound');

// Function to update the timer display
function updateTimerDisplay(timeLeft) {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Function to start the timer
function startTimer(duration) {
    let timeLeft = duration;
    console.log('Timer started');

    updateTimerDisplay(timeLeft); // Immediately update the display
    toggleBrownNoise(true); // Start brown noise when timer starts

    interval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft < 0) {
            clearInterval(interval);
            handleTimerCompletion();
        }
    }, 1000);
}

// Handle what happens when the timer completes
function handleTimerCompletion() {
    console.log('Timer completed');
    notificationSound.play(); // Play notification sound
    toggleBrownNoise(false); // Stop brown noise

    if (isWorkPeriod) {
        pomodoroCount++;
        updatePomodoroDots(pomodoroCount);

        if (pomodoroCount === 4) {
            startBreak(longBreakTime); // Start long break after 4 Pomodoros
            pomodoroCount = 0; // Reset Pomodoro count after long break
            resetPomodoroDots();
        } else {
            startBreak(shortBreakTime); // Start short break
        }
    } else {
        startTimer(workTime); // Start new work session
    }

    isWorkPeriod = !isWorkPeriod; // Toggle between work and break
}

// Function to start break automatically
function startBreak(breakTime) {
    toggleBrownNoise(false); // Stop brown noise for breaks
    startTimer(breakTime); // Start the break timer
}

// Update Pomodoro progress dots based on completed sessions
function updatePomodoroDots(count) {
    if (count <= 4) {
        dots[count - 1].classList.add('completed');
    }
}

// Reset the Pomodoro progress dots to their original state
function resetPomodoroDots() {
    dots.forEach(dot => dot.classList.remove('completed'));
}

// Function to activate a button
function activateButton(button) {
    startButton.classList.remove('active');
    resetButton.classList.remove('active');
    button.classList.add('active');
}

// Function to toggle brown noise
function toggleBrownNoise(start) {
    if (start) {
        brownNoise.play();
        brownNoise.loop = true; // Ensure brown noise loops
    } else {
        brownNoise.pause();
        brownNoise.currentTime = 0; // Reset brown noise to start
    }
}

// Start Button Event
startButton.addEventListener('click', () => {
    console.log('Start button clicked');
    clearInterval(interval);
    isWorkPeriod = true;
    activateButton(startButton); // Activate start button
    startTimer(workTime);
});

// Reset Button Event
resetButton.addEventListener('click', () => {
    console.log('Reset button clicked');
    clearInterval(interval);
    timerDisplay.textContent = '50:00';
    isWorkPeriod = true;
    pomodoroCount = 0; // Reset Pomodoro count
    resetPomodoroDots(); // Reset progress dots
    toggleBrownNoise(false); // Stop brown noise when resetting
    activateButton(resetButton); // Activate reset button
});
