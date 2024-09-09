// Constants for durations
const POMODORO_DURATION = 5;
const SHORT_BREAK_DURATION = 5;
const LONG_BREAK_DURATION = 20 * 60;

// Variables
let timer;
let isRunning = false;
let isPaused = false;
let currentPhase = 'pomodoro';
let pomodorosCompleted = 0;
let remainingTime = 0;
let allowStart = true;  // Flag to control start button
let allowPause = false; // Flag to control pause button

// Get elements from the DOM
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const skipButton = document.getElementById('skipButton');
const clockElement = document.getElementById('clock');
const pomodoroCounterDisplay = document.getElementById('pomodoroCounter');
const brownNoise = document.getElementById('brownNoise');
const notificationSound = document.getElementById('notificationSound');

// Initialize Pomodoro counter from local storage
let allTimePomodoros = localStorage.getItem('allTimePomodoros') || 0;
pomodoroCounterDisplay.innerText = `All Time: ${allTimePomodoros}`;

// Timer Initialization - Show 50:00 in white when no timer is active
timerDisplay.innerText = '50:00';
timerDisplay.style.color = 'white';

// Update the timer display
function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Start or resume the timer
function startTimer() {
    if (!allowStart) return; // Prevent starting multiple times consecutively

    if (timer) clearInterval(timer);

    isRunning = true;
    isPaused = false;
    allowStart = false;   // Disable start until pause is pressed
    allowPause = true;    // Enable pause button after starting
    updateButtonStyles();

    let duration = currentPhase === 'pomodoro' ? POMODORO_DURATION
        : currentPhase === 'shortBreak' ? SHORT_BREAK_DURATION
        : LONG_BREAK_DURATION;

    updateTimerDisplay(duration);
    timerDisplay.style.color = currentPhase === 'pomodoro' ? '#FF4F00' : '#4caf50';

    if (currentPhase === 'pomodoro') brownNoise.play();

    timer = setInterval(() => {
        duration--;
        remainingTime = duration;
        updateTimerDisplay(duration);

        if (duration <= 0) {
            clearInterval(timer);
            isRunning = false;
            remainingTime = 0;
            brownNoise.pause();
            brownNoise.currentTime = 0;
            handleEndOfSession();
        }
    }, 1000);
}

// Handle pause
function togglePause() {
    if (!allowPause) return; // Prevent multiple consecutive pauses

    if (isRunning) {
        if (isPaused) {
            startTimer(); // Resume the timer if paused
        } else {
            clearInterval(timer);
            isPaused = true;
            allowPause = false;  // Disable pause until start is pressed again
            allowStart = true;   // Enable start button after pausing
            updateButtonStyles();
            brownNoise.pause();
            brownNoise.currentTime = 0;
        }
    }
}

// Handle skip button functionality
function skipSession() {
    if (currentPhase !== 'pomodoro') {
        if (timer) clearInterval(timer);
        brownNoise.pause();
        brownNoise.currentTime = 0;

        currentPhase = 'pomodoro';
        remainingTime = POMODORO_DURATION;
        updateTimerDisplay(POMODORO_DURATION);
        timerDisplay.style.color = '#FF4F00';

        isRunning = true;
        isPaused = false;
        allowStart = false;
        allowPause = true;
        updateButtonStyles();
        startTimer();
    }
}

// Handle end of session
function handleEndOfSession() {
    if (currentPhase === 'pomodoro') {
        pomodorosCompleted++;
        allTimePomodoros++;
        localStorage.setItem('allTimePomodoros', allTimePomodoros);
        pomodoroCounterDisplay.innerText = `All Time: ${allTimePomodoros}`;
        updateDots();
        currentPhase = pomodorosCompleted % 4 === 0 ? 'longBreak' : 'shortBreak';
        notificationSound.play();
    } else {
        currentPhase = 'pomodoro';
        notificationSound.play();
    }
    startTimer();
}

// Update button styles
function updateButtonStyles() {
    // If the start button is pressed, hide its border (0px) and show the pause button's border (8px)
    if (!allowStart) {
        startButton.style.border = '8px solid rgba(255, 255, 255, 0)'; // Set border of start button to 0px
        pauseButton.style.border = '8px solid rgba(255, 255, 255, 1)'; // Set border of pause button to 8px
    } 
    // If the pause button is pressed, hide its border (0px) and show the start button's border (8px)
    else if (!allowPause) {
        startButton.style.border = '8px solid rgba(255, 255, 255, 1)'; // Set border of start button to 8px
        pauseButton.style.border = '8px solid rgba(255, 255, 255, 0)'; // Set border of pause button to 0px
    } 
    // Default state: Ensure both borders are 8px when no button is active
    else {
        startButton.style.border = '8px solid rgba(255, 255, 255, 1)'; // Ensure start button border is 8px
        pauseButton.style.border = '8px solid rgba(255, 255, 255, 1)'; // Ensure pause button border is 8px
    }
}


// Update dots opacity
function updateDots() {
    for (let i = 1; i <= 12; i++) {
        const dot = document.getElementById(`dot${i}`);
        dot.style.opacity = i <= pomodorosCompleted ? 1 : 0;
    }
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', togglePause);
skipButton.addEventListener('click', skipSession);

// Clock initialization
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 60000);

