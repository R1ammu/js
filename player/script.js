// PLAYER
let isPlaying = false;
const audioElement = document.querySelector('#brownNoise');
const notificationSound = new Audio('/js/player/audio/level-up-191997.mp3');

// Play or Pause the audio
document.querySelector('#audioPlayButton').addEventListener('click', function () {
    console.log('Audio play button clicked');
    isPlaying ? audioElement.pause() : audioElement.play();
    isPlaying = !isPlaying;
});

// TIMER
let workTime = 50 * 60; // 50 minutes in seconds
let shortBreakTime = 5 * 60; // 5 minutes in seconds
let longBreakTime = 20 * 60; // 20 minutes in seconds
let cycleCount = 0;
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
    audioElement.play(); // Start brown noise when timer starts

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

    if (isWorkPeriod) {
        cycleCount++;
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
    cycleCount = 0;
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
    cycleCount = 0;
    isWorkPeriod = true;
    pomodoroCount = 0; // Reset Pomodoro count
    resetPomodoroDots(); // Reset progress dots
    audioElement.pause(); // Pause brown noise when timer resets
    audioElement.currentTime = 0; // Reset the audio to the beginning
    updatePomodoroCounter(); // Update the counter display
});

// TASK LIST
const taskInput = document.getElementById('taskInput');
const tasksUl = document.getElementById('tasks');

// Function to save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
}

// Function to render tasks
function renderTasks(tasks) {
    tasksUl.innerHTML = '';

    // Render all tasks
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('completed');
        }

        // Toggle task completion on click
        li.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed; // Toggle completion status
            saveTasks(tasks);
            renderTasks(tasks);
        });

        tasksUl.appendChild(li);
    });
}

// Initialize the task list
let tasks = loadTasks();
renderTasks(tasks);

// Function to add a task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);
        renderTasks(tasks);
        taskInput.value = ''; // Clear input field
    }
}

// Add Task Event: Pressing "Enter" Key
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Update Pomodoro counter display
function updatePomodoroCounter() {
    document.getElementById('pomodoroCounter').textContent = `Pomodoros: ${pomodoroCount}`;
}
