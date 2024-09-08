const taskInput = document.getElementById('taskInput');
const tasksUl = document.getElementById('tasks');
const taskCountSpan = document.getElementById('taskCount');

// Function to convert a number to Roman numeral
function toRoman(num) {
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];
    let result = '';
    for (const { value, numeral } of romanNumerals) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }
    return result;
}

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

        // Apply styles based on task state
        if (task.completed) {
            li.classList.add('completed-task');
        }

        // Click handler to change color and cross out on first click, remove on second click
        li.addEventListener('click', () => {
            if (!task.completed) {
                // Mark task as completed
                task.completed = true;
                li.classList.add('completed-task');
                saveTasks(tasks); // Update localStorage
            } else {
                // Remove task on the second click
                tasks.splice(index, 1); // Remove task from array
                saveTasks(tasks); // Update localStorage
                renderTasks(tasks); // Re-render task list
            }
        });

        // Prepend new tasks to the beginning of the list
        tasksUl.insertBefore(li, tasksUl.firstChild);
    });

    // Update task count
    taskCountSpan.textContent = toRoman(tasks.length);
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
