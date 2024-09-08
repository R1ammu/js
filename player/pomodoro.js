// Constants for durations
const POMODORO_DURATION = 50 * 60; // 10 seconds for testing
const SHORT_BREAK_DURATION = 5 * 60; // 10 seconds for testing
const LONG_BREAK_DURATION = 20 * 60; // 20 minutes in seconds

// Variables
let timer;
let isRunning = false;
let isPaused = false;
let currentPhase = 'pomodoro';
let pomodorosCompleted = 0;
let remainingTime = 0;

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
    // Ensure no other timers are running
    if (timer) {
        clearInterval(timer);
    }

    isRunning = true;
    isPaused = false;
    updateButtonStyles();

    let duration = currentPhase === 'pomodoro' ? POMODORO_DURATION
        : currentPhase === 'shortBreak' ? SHORT_BREAK_DURATION
        : LONG_BREAK_DURATION;

    // Immediately update the display with the correct time
    updateTimerDisplay(duration);

    // Set the timer display color
    timerDisplay.style.color = currentPhase === 'pomodoro' ? '#FF4F00' : '#4caf50';

    if (currentPhase === 'pomodoro') {
        brownNoise.play();
    }

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
    if (isRunning) {
        if (isPaused) {
            // Resume the timer
            startTimer();
        } else {
            // Pause the timer and reset the brown noise
            clearInterval(timer);
            isPaused = true;
            updateButtonStyles();
            brownNoise.pause();
            brownNoise.currentTime = 0; // Reset brown noise to start
        }
    }
}

// Handle skip button functionality
function skipSession() {
    if (currentPhase !== 'pomodoro') {
        // Stop any ongoing timer
        if (timer) {
            clearInterval(timer);
        }
        brownNoise.pause();
        brownNoise.currentTime = 0;

        // Prepare for the next Pomodoro session
        currentPhase = 'pomodoro';
        remainingTime = POMODORO_DURATION;

        // Update the display immediately
        updateTimerDisplay(POMODORO_DURATION);
        timerDisplay.style.color = '#FF4F00'; // Set color to orange

        // Reset flags and start the timer
        isRunning = true;
        isPaused = false;
        updateButtonStyles();

        // Start the new Pomodoro session immediately
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
    // Start the next timer based on the new phase
    startTimer();
}

// Update button styles
function updateButtonStyles() {
    startButton.classList.toggle('active', isRunning && !isPaused);
    pauseButton.classList.toggle('active', isPaused);
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
