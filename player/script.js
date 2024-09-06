// PLAYER

document.querySelector('#audioPlayButton').addEventListener('click', function() {
    const audioElement = document.querySelector('#myAudio');
    
    if (!isPlaying) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
    isPlaying = !isPlaying;
});

// TIMER

let workTime = 50 * 60; // 50 minutes in seconds
let shortBreakTime = 5 * 60; // 5 minutes in seconds
let longBreakTime = 20 * 60; // 20 minutes in seconds
let cycleCount = 0;
let isWorkPeriod = true;
let interval;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function updateTimerDisplay(timeLeft) {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer(duration) {
  let timeLeft = duration;

  // Immediately update the display
  updateTimerDisplay(timeLeft);

  interval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft);

    if (timeLeft < 0) {
      clearInterval(interval);
      if (isWorkPeriod) {
        cycleCount++;
        if (cycleCount % 4 === 0) {
          alert("Time for a 20-minute break!");
          startTimer(longBreakTime);
        } else {
          alert("Time for a 5-minute break!");
          startTimer(shortBreakTime);
        }
      } else {
        if (cycleCount % 4 === 0) {
          alert("Work session starting after a long break!");
        } else {
          alert("Work session starting after a short break!");
        }
        startTimer(workTime);
      }
      isWorkPeriod = !isWorkPeriod;
    }
  }, 1000);
}

startButton.addEventListener('click', () => {
  clearInterval(interval);
  isWorkPeriod = true;
  cycleCount = 0;
  startTimer(workTime);
});

resetButton.addEventListener('click', () => {
  clearInterval(interval);
  timerDisplay.textContent = '50:00';
  cycleCount = 0;
  isWorkPeriod = true;
});

// TASK LIST


    // Task List Logic
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
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
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
          li.classList.add('completed');
        }
        li.addEventListener('click', () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks(tasks);
          renderTasks(tasks);
        });
        tasksUl.appendChild(li);
      });
    }

    // Initialize the task list
    let tasks = loadTasks();
    renderTasks(tasks);

    // Add Task
    addTaskButton.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      if (taskText) {
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);
        renderTasks(tasks);
        taskInput.value = ''; // Clear input field
      }
    });