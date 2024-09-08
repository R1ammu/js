let pomodoroDuration = 60; // 1 minute in seconds
let shortBreakDuration = 1 * 60; // 1 minute in seconds
let longBreakDuration = 20 * 60; // 20 minutes in seconds
let isPaused = false;
let isRunning = false;
let timer; // Holds the current interval timer
let currentPhase = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
let pomodorosCompleted = 0;
let skipTime = 0;
let currentDot = 1; // Keeps track of the current dot to activate

// Get elements from the DOM
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const dots = document.querySelectorAll('.dot'); // Assuming dots are selected by class .dot
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

// Update timer color based on phase
function updateTimerColor() {
    if (currentPhase === 'pomodoro') {
        timerDisplay.classList.add('pomodoro-text');
        timerDisplay.classList.remove('break-text');
    } else {
        timerDisplay.classList.add('break-text');
        timerDisplay.classList.remove('pomodoro-text');
    }
}

// Update dot opacity after each Pomodoro
function updateDotsAfterPomodoro() {
    if (currentDot <= 12) {
        const dot = document.getElementById(`dot${currentDot}`);
        if (dot) {
            dot.style.opacity = '100%'; // Set opacity to 100%
        }
        currentDot++;
    }
}

// Start or resume the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        updateButtonStyles(); // Update button styles
        updateTimerColor();  // Update timer color
        timer = setInterval(() => {
            if (currentPhase === 'pomodoro' && pomodoroDuration > 0) {
                pomodoroDuration--;
                updateTimerDisplay(pomodoroDuration);
            } else if (currentPhase === 'pomodoro') {
                pomodorosCompleted++;
                updatePomodoroCounter();
                updateDotsAfterPomodoro(); // Update dot opacity after Pomodoro
                clearInterval(timer);
                isRunning = false;
                startBreak();
            } else if (currentPhase === 'shortBreak' && shortBreakDuration > 0) {
                shortBreakDuration--;
                updateTimerDisplay(shortBreakDuration);
            } else if (currentPhase === 'shortBreak') {
                clearInterval(timer);
                currentDot++;
                if (pomodorosCompleted % 3 === 0) {
                    startLongBreak();
                } else {
                    startPomodoro();
                }
            } else if (currentPhase === 'longBreak' && longBreakDuration > 0) {
                longBreakDuration--;
                updateTimerDisplay(longBreakDuration);
            } else if (currentPhase === 'longBreak') {
                clearInterval(timer);
                startPomodoro();
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

// Start a short break
function startBreak() {
    currentPhase = 'shortBreak';
    shortBreakDuration += skipTime; // Add any skipped time
    skipTime = 0; // Reset skip time for the next cycle
    updateTimerColor(); // Update timer color
    startTimer();
}

// Start a long break
function startLongBreak() {
    currentPhase = 'longBreak';
    longBreakDuration += skipTime; // Add any skipped time
    skipTime = 0; // Reset skip time for the next cycle
    updateTimerColor(); // Update timer color
    startTimer();
}

// Start a new Pomodoro
function startPomodoro() {
    currentPhase = 'pomodoro';
    pomodoroDuration = 60; // Reset to 1 minute
    updateTimerColor(); // Update timer color
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

// Initial setup
updateTimerDisplay(pomodoroDuration);
updateTimerColor(); // Set initial color based on default phase

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
