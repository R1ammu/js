// PLAYER
const audioElement = document.querySelector('#brownNoise');
const notificationSound = new Audio('/js/player/audio/level-up-191997.mp3');

// Toggle brown noise
function toggleBrownNoise() {
    if (audioElement.paused) {
        audioElement.currentTime = 0; // Reset to start
        audioElement.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    } else {
        audioElement.pause();
    }
}

// TIMER
const workTime = 50 * 60; // 50 minutes in seconds
const shortBreakTime = 5 * 60; // 5 minutes in seconds
const longBreakTime = 20 * 60; // 20 minutes in seconds
let isWorkPeriod = true;
let interval;
let pomodoroCount = 0; // Track number of completed Pomodoros

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const dots = document.querySelectorAll('.dot');

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
    audioElement.currentTime = 0; // Reset the audio to the beginning
    audioElement.play().catch(error => {
        console.error('Error playing brown noise:', error);
    }); // Start brown noise when timer starts

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
    notificationSound.play().catch(error => {
        console.error('Error playing notification sound:', error);
    }); // Play notification sound

    if (isWorkPeriod) {
        pomodoroCount++;
        updatePomodoroDots(pomodoroCount);

        if (pomodoroCount === 4) {
            alert("You've completed 4 Pomodoros! Time for a 20-minute break.");
            startTimer(longBreakTime);
            pomodoroCount = 0; // Reset Pomodoro count after long break
            resetPomodoroDots();
        } else {
            alert("Time for a 5-minute break!");
            startTimer(shortBreakTime);
        }
    } else {
        alert("Work session starting again!");
        startTimer(workTime);
    }

    isWorkPeriod = !isWorkPeriod;
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

// Start Button Event
startButton.addEventListener('click', () => {
    console.log('Start button clicked');
    clearInterval(interval);
    isWorkPeriod = true;
    pomodoroCount = 0;
    startTimer(workTime);
});

// Stop Button Event
stopButton.addEventListener('click', () => {
    console.log('Stop button clicked');
    clearInterval(interval); // Stop the timer
    audioElement.pause(); // Pause brown noise when timer stops
});

// Reset Button Event
resetButton.addEventListener('click', () => {
    console.log('Reset button clicked');
    clearInterval(interval);
    timerDisplay.textContent = '50:00';
    isWorkPeriod = true;
    pomodoroCount = 0; // Reset Pomodoro count
    resetPomodoroDots(); // Reset progress dots
    audioElement.pause(); // Pause brown noise when timer resets
    audioElement.currentTime = 0; // Reset the audio to the beginning
    updatePomodoroCounter(); // Update the counter display
});

// Update Pomodoro counter display
function updatePomodoroCounter() {
    document.getElementById('pomodoroCounter').textContent = `Pomodoros: ${pomodoroCount}`;
}
