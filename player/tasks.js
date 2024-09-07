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
            li.classList.add('completed-task');
        }

        // Toggle task completion on click
        li.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed; // Toggle completion status
            saveTasks(tasks);
            renderTasks(tasks);
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
