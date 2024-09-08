let pomodoroDuration = 60; // 1 minute in seconds
let shortBreakDuration = 5 * 60; // 5 minutes in seconds
let longBreakDuration = 20 * 60; // 20 minutes in seconds
let isPaused = false;
let isRunning = false;
let timer; // Holds the current interval timer
let currentPhase = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
let pomodorosCompleted = 0;
let skipTime = 0;
let currentDot = 1;

// Get elements from the DOM
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const skipButton = document.getElementById('skipButton');
const dots = document.querySelectorAll('.dot');
const pomodoroCounterDisplay = document.getElementById('pomodoroCounter');

// Initialize pomodoro counter from local storage
let allTimePomodoros = localStorage.getItem('allTimePomodoros') || 0;
pomodoroCounterDisplay.innerText = `All Time: ${allTimePomodoros}`;

// Update the timer display
function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Update button styles
function updateButtonStyles() {
    if (isRunning) {
        startButton.classList.add('active');
        pauseButton.classList.remove('active');
        startButton.style.borderColor = 'rgba(255, 79, 0, 0)'; // Set border color to 0 opacity
        pauseButton.style.borderColor = 'white'; // Reset pause button border
    } else if (isPaused) {
        pauseButton.classList.add('active');
        startButton.classList.remove('active');
        pauseButton.style.borderColor = 'rgba(255, 79, 0, 0)'; // Set border color to 0 opacity
        startButton.style.borderColor = 'white'; // Reset start button border
    } else {
        startButton.style.borderColor = 'white'; // Reset both to white when inactive
        pauseButton.style.borderColor = 'white';
    }
}

// Start or resume the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        updateButtonStyles(); // Update button styles
        timer = setInterval(() => {
            if (pomodoroDuration > 0) {
                pomodoroDuration--;
                updateTimerDisplay(pomodoroDuration);
                updateDots(pomodoroDuration, 'pomodoro');
            } else if (currentPhase === 'pomodoro') {
                pomodorosCompleted++;
                updatePomodoroCounter();
                clearInterval(timer);
                isRunning = false;
                startBreak();
            }
        }, 1000);
    }
}

// Pause or resume the timer when the pause button is pressed
function togglePause() {
    if (isRunning) {
        clearInterval(timer); // Pause the timer
        isRunning = false;
        isPaused = true;
    } else if (isPaused) {
        startTimer(); // Resume the timer
        isPaused = false;
    }
    updateButtonStyles(); // Update button styles
}

// Update dots opacity
function updateDots(timeLeft, phase) {
    let totalDuration = phase === 'pomodoro' ? 60 : (phase === 'shortBreak' ? 5 * 60 : 20 * 60);
    let progress = (totalDuration - timeLeft) / totalDuration;
    for (let i = 0; i < dots.length; i++) {
        dots[i].style.opacity = i < currentDot ? '1' : '0.3';
        dots[i].style.backgroundColor = phase === 'pomodoro' ? '#FF4F00' : (phase === 'shortBreak' ? '#4CAF50' : '#FFC107');
    }
}

// Fix for skipping break: Skip current break and add time to the next break
function skipBreak() {
    if (currentPhase === 'shortBreak' || currentPhase === 'longBreak') {
        skipTime += (currentPhase === 'shortBreak') ? shortBreakDuration : longBreakDuration;
        clearInterval(timer);
        isRunning = false;
        updateButtonStyles(); // Update button styles
        startPomodoro(); // Start new Pomodoro and add skipped time to the next break
    }
}

// Start a short break
function startBreak() {
    currentPhase = 'shortBreak';
    shortBreakDuration += skipTime; // Add any skipped time
    timer = setInterval(() => {
        if (shortBreakDuration > 0) {
            shortBreakDuration--;
            updateTimerDisplay(shortBreakDuration);
            updateDots(shortBreakDuration, 'shortBreak');
        } else {
            clearInterval(timer);
            currentDot++;
            if (pomodorosCompleted % 3 === 0) {
                startLongBreak();
            } else {
                startPomodoro();
            }
        }
    }, 1000);
}

// Start a long break
function startLongBreak() {
    currentPhase = 'longBreak';
    longBreakDuration += skipTime; // Add any skipped time
    timer = setInterval(() => {
        if (longBreakDuration > 0) {
            longBreakDuration--;
            updateTimerDisplay(longBreakDuration);
            updateDots(longBreakDuration, 'longBreak');
        } else {
            clearInterval(timer);
            startPomodoro();
        }
    }, 1000);
}

// Start a new Pomodoro
function startPomodoro() {
    currentPhase = 'pomodoro';
    pomodoroDuration = 60; // Reset to 1 minute
    startTimer();
}

// Update Pomodoro counter
function updatePomodoroCounter() {
    allTimePomodoros++;
    localStorage.setItem('allTimePomodoros', allTimePomodoros);
    pomodoroCounterDisplay.innerText = `All Time: ${allTimePomodoros}`;
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', togglePause);
skipButton.addEventListener('click', skipBreak);

// Initial setup
updateTimerDisplay(pomodoroDuration);

// Function to update the system time (without seconds)
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
}

// Update clock every minute
setInterval(updateClock, 60000);

// Call the function once on page load to avoid delay
updateClock();
