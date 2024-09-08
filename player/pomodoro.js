// Constants for durations
const POMODORO_DURATION = 10; // 10 seconds
const SHORT_BREAK_DURATION = 10; // 10 seconds
const LONG_BREAK_DURATION = 20 * 60; // 20 minutes in seconds

// Variables
let timer; // Holds the current interval timer
let isRunning = false;
let isPaused = false;
let currentPhase = 'pomodoro'; // 'pomodoro', 'shortBreak', or 'longBreak'
let pomodorosCompleted = 0;
let skipTime = 0;
let remainingTime = 0; // Time left in the current session

// Get elements from the DOM
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const pomodoroCounterDisplay = document.getElementById('pomodoroCounter');
const clockElement = document.getElementById('clock');
const skipButton = document.getElementById('skipButton');

// Initialize Pomodoro counter from local storage
let allTimePomodoros = localStorage.getItem('allTimePomodoros') || 0;
pomodoroCounterDisplay.innerText = `All Time: ${allTimePomodoros}`;

// Update the timer display
function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Update the clock display
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
}

// Start or resume the timer
function startTimer() {
    if (!isRunning || isPaused) {
        isRunning = true;
        isPaused = false;
        updateButtonStyles(); // Update button styles
        updateTimerColor();  // Update timer color

        let duration;
        if (currentPhase === 'pomodoro') {
            duration = POMODORO_DURATION;
        } else if (currentPhase === 'shortBreak') {
            duration = SHORT_BREAK_DURATION;
        } else if (currentPhase === 'longBreak') {
            duration = LONG_BREAK_DURATION;
        }
        
        // Use remainingTime if resuming
        duration = remainingTime > 0 ? remainingTime : duration;

        timer = setInterval(() => {
            duration--;
            remainingTime = duration; // Track remaining time
            updateTimerDisplay(duration);

            if (duration <= 0) {
                clearInterval(timer);
                isRunning = false;
                isPaused = false;
                remainingTime = 0;
                updateButtonStyles(); // Update button styles
                updateTimerColor();  // Update timer color
                handleEndOfSession();
            }
        }, 1000);
    }
}

// Pause or resume the timer
function togglePause() {
    if (isRunning) {
        if (isPaused) {
            startTimer(); // Resume the timer
        } else {
            clearInterval(timer);
            isPaused = true;
            updateButtonStyles(); // Update button styles
        }
    }
}

// Handle the end of Pomodoro or break session
function handleEndOfSession() {
    if (currentPhase === 'pomodoro') {
        pomodorosCompleted++;
        allTimePomodoros++;
        localStorage.setItem('allTimePomodoros', allTimePomodoros);
        pomodoroCounterDisplay.innerText = `All Time: ${allTimePomodoros}`;
        
        // Update dots
        updateDots();
        
        // Check if it's time for a long break
        if (pomodorosCompleted % 4 === 0) {
            currentPhase = 'longBreak';
        } else {
            currentPhase = 'shortBreak';
        }
    } else if (currentPhase === 'shortBreak' || currentPhase === 'longBreak') {
        currentPhase = 'pomodoro';
    }

    // Start the next phase
    startTimer();
}

// Update dot opacity
function updateDots() {
    for (let i = 1; i <= 12; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (i <= pomodorosCompleted) {
            dot.style.opacity = 1;
        } else {
            dot.style.opacity = 0;
        }
    }
}

// Update button styles
function updateButtonStyles() {
    startButton.classList.toggle('active', isRunning && !isPaused);
    pauseButton.classList.toggle('active', isPaused);
}

// Update timer color
function updateTimerColor() {
    timerDisplay.classList.toggle('pomodoro-text', currentPhase === 'pomodoro');
    timerDisplay.classList.toggle('break-text', currentPhase === 'shortBreak' || currentPhase === 'longBreak');
}

// Event listeners
startButton.addEventListener('click', () => {
    startTimer();
});

pauseButton.addEventListener('click', () => {
    togglePause();
});

skipButton.addEventListener('click', () => {
    if (currentPhase === 'shortBreak' || currentPhase === 'longBreak') {
        clearInterval(timer); // Stop the current timer
        handleEndOfSession(); // Skip to the next Pomodoro
    }
});

// Initial setup
updateClock(); // Update the clock initially
setInterval(updateClock, 60000); // Update the clock every minute
