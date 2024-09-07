// PLAYER
let isPlaying = false;
const brownNoise = new Audio('/js/player/audio/Academic Brown 1 hr Brown Noise_ A Sonic Wellness Journey Meditation, Study, Focus, Calming.mp3');
const notificationSound = new Audio('/js/player/audio/level-up-191997.mp3');

document.querySelector('#audioPlayButton').addEventListener('click', function () {
  isPlaying ? brownNoise.pause() : brownNoise.play();
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
  updateTimerDisplay(timeLeft); // Immediately update the display
  brownNoise.play(); // Start playing brown noise

  interval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay(timeLeft);

      if (timeLeft < 0) {
          clearInterval(interval);
          brownNoise.pause(); // Pause the brown noise
          handleTimerCompletion();
      }
  }, 1000);
}

// Handle what happens when the timer completes
function handleTimerCompletion() {
  if (isWorkPeriod) {
      cycleCount++;
      pomodoroCount++;
      updatePomodoroDots(pomodoroCount);

      notificationSound.play(); // Play notification sound

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
      const currentDot = dots[count - 1];
      currentDot.classList.add('active');
      setTimeout(() => {
          currentDot.classList.remove('active');
          currentDot.classList.add('completed');
      }, 3000); // Time for the fade effect
  }
}

// Reset the Pomodoro progress dots to their original state
function resetPomodoroDots() {
  dots.forEach(dot => {
      dot.classList.remove('completed');
      dot.classList.remove('active');
  });
}

// Start Button Event
startButton.addEventListener('click', () => {
  clearInterval(interval);
  isWorkPeriod = true;
  cycleCount = 0;
  startTimer(workTime);
});

// Stop Button Event
stopButton.addEventListener('click', () => {
  clearInterval(interval); // Stop the timer
  brownNoise.pause(); // Pause the brown noise
});

// Reset Button Event
resetButton.addEventListener('click', () => {
  clearInterval(interval);
  timerDisplay.textContent = '50:00';
  cycleCount = 0;
  isWorkPeriod = true;
  pomodoroCount = 0; // Reset Pomodoro count
  resetPomodoroDots(); // Reset progress dots
  brownNoise.pause(); // Pause the brown noise
});

// TASK LIST
const taskInput = document.getElementById('taskInput');
const tasksUl = document.getElementById('tasks');

// Set a maximum number of tasks allowed on screen
const maxVisibleTasks = 10; // Adjust this value based on how many tasks should fit on the screen

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

  // First, render incomplete tasks
  tasks.filter(task => !task.completed).forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task.text;

      // Toggle task completion on click
      li.addEventListener('click', () => {
          tasks[index].completed = true; // Mark task as completed
          saveTasks(tasks);
          renderTasks(tasks);
      });

      tasksUl.appendChild(li);
  });

  // Then, render completed tasks at the bottom
  tasks.filter(task => task.completed).forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task.text;
      li.classList.add('completed');

      // Toggle task completion on click
      li.addEventListener('click', () => {
          tasks[index].completed = false; // Unmark task as completed
          saveTasks(tasks);
          renderTasks(tasks);
      });

      tasksUl.appendChild(li);
  });

  // Check for overflow and remove oldest tasks if necessary
  if (tasksUl.children.length > maxVisibleTasks) {
      const overflowCount = tasksUl.children.length - maxVisibleTasks;
      for (let i = 0; i < overflowCount; i++) {
          tasks.shift(); // Remove oldest task from the tasks array
      }
      saveTasks(tasks); // Save updated tasks to localStorage
      renderTasks(tasks); // Re-render tasks after removal
  }
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
