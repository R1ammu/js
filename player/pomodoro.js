const workTime = 50 * 60; // 50 minutes in seconds
const shortBreakTime = 5 * 60; // 5 minutes in seconds
const longBreakTime = 20 * 60; // 20 minutes in seconds
let isWorkPeriod = true;
let interval;
let pomodoroCount = 0; // Track number of completed Pomodoros
let isPaused = false; // Track if the timer is paused
let remainingTime; // Track remaining time when paused

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
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
    remainingTime = timeLeft; // Store remaining time
    console.log('Timer started');

    updateTimerDisplay(timeLeft); // Immediately update the display
    toggleBrownNoise(true); // Start brown noise when timer starts

    interval = setInterval(() => {
        if (!isPaused) { // Only decrement time if not paused
            timeLeft--;
            updateTimerDisplay(timeLeft);
            remainingTime = timeLeft; // Update remaining time

            if (timeLeft < 0) {
                clearInterval(interval);
                handleTimerCompletion();
            }
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
    if (button === startButton) {
        startButton.classList.add('active');
        pauseButton.classList.remove('active');
        startButton.classList.remove('inactive');
        pauseButton.classList.add('inactive');
    } else {
        pauseButton.classList.add('active');
        startButton.classList.remove('active');
        pauseButton.classList.remove('inactive');
        startButton.classList.add('inactive');
    }
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
    if (!interval && !isPaused) {
        console.log('Start button clicked');
        activateButton(startButton); // Activate start button
        startTimer(workTime);
    }
});

// Pause Button Event
pauseButton.addEventListener('click', () => {
    if (interval && !isPaused) {
        console.log('Pause button clicked');
        clearInterval(interval);
        interval = null; // Clear interval
        toggleBrownNoise(false); // Stop brown noise
        isPaused = true; // Set paused state
        activateButton(pauseButton); // Activate pause button
    } else if (!interval && isPaused) {
        console.log('Resuming timer');
        isPaused = false; // Unpause
        toggleBrownNoise(true); // Start brown noise
        startTimer(remainingTime); // Resume timer from remaining time
        activateButton(startButton); // Activate start button
    }
});
