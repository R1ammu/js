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

    // Render up to 10 most recent tasks
    const tasksToRender = tasks.slice(0, 10);
    tasksToRender.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('completed-task');
        }

        // Click handler to change color and cross out on first click, remove on second click
        let clickCount = 0;
        li.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 1) {
                // First click: change color and cross out
                li.classList.add('completed-task');
            } else if (clickCount === 2) {
                // Second click: remove the task
                tasks.splice(index, 1); // Remove task from array
                saveTasks(tasks); // Update localStorage
                renderTasks(tasks); // Re-render task list
            }
        });

        // Prepend new tasks to the beginning of the list
        tasksUl.insertBefore(li, tasksUl.firstChild);
    });
}

// Initialize the task list
let tasks = loadTasks();
renderTasks(tasks);

// Function to add a task
function addTask() {
    if (tasks.length >= 10) {
        return; // Prevent adding new tasks if there are already 10
    }

    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.unshift({ text: taskText, completed: false }); // Add new tasks at the beginning
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
