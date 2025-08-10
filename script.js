const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No tasks yet';
    li.style.fontStyle = 'italic';
    li.style.color = '#555';
    taskList.appendChild(li);
    return;
  }
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.title = 'Edit task';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id, span));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete task';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      addTask(text);
      taskInput.value = '';
    }
  }
});

function addTask(text) {
  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id, spanElem) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = spanElem.textContent;
  spanElem.replaceWith(input);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText) {
      tasks = tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      );
      saveTasks();
      renderTasks();
    } else {
      renderTasks();
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
    if (e.key === 'Escape') {
      renderTasks();
    }
  });
  input.addEventListener('blur', saveEdit);
}

loadTasks();
renderTasks();