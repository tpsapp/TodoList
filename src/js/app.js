// Main JavaScript file for the Todo List application

// Select DOM elements
const listInput = document.getElementById('list-input');
const addListButton = document.getElementById('add-list-button');
const listsContainer = document.getElementById('lists-container');

// Select modal elements
const modal = document.getElementById('list-modal');
const modalTitle = document.getElementById('modal-title');
const todoListContainer = document.getElementById('todo-list-container');
const todoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo-button');
const closeModal = document.getElementById('close-modal');

// Load lists from local storage
let todoLists = JSON.parse(localStorage.getItem('todoLists')) || {};

// Function to render all lists
function renderLists() {
    listsContainer.innerHTML = '';
    Object.keys(todoLists).forEach((listName) => {
        const listContainer = document.createElement('div');
        listContainer.classList.add('list-container');

        const listHeader = document.createElement('div');
        listHeader.classList.add('list-header');

        const listTitle = document.createElement('h3');
        listTitle.textContent = listName;
        listHeader.appendChild(listTitle);

        const buttonGroup = document.createElement('div'); // Group buttons together
        buttonGroup.classList.add('button-group');

        const openListButton = document.createElement('button');
        openListButton.textContent = 'Open';
        openListButton.onclick = () => openListModal(listName); // Attach the modal opening functionality
        buttonGroup.appendChild(openListButton);

        const deleteListButton = document.createElement('button');
        deleteListButton.textContent = 'Delete';
        deleteListButton.onclick = () => deleteList(listName); // Attach the delete functionality
        buttonGroup.appendChild(deleteListButton);

        listHeader.appendChild(buttonGroup);
        listContainer.appendChild(listHeader);
        listsContainer.appendChild(listContainer);
    });
}

// Function to render todos for a specific list
function renderTodos(listName, container) {
    container.innerHTML = '';
    todoLists[listName].forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        if (todo.completed) {
            todoItem.classList.add('completed'); // Add a class for completed items
        }

        const todoText = document.createElement('span');
        todoText.textContent = todo.text;
        todoItem.appendChild(todoText);

        const completeButton = document.createElement('button');
        completeButton.textContent = todo.completed ? 'Undo' : 'Complete';
        completeButton.onclick = () => toggleTodoCompletion(listName, index);
        todoItem.appendChild(completeButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTodo(listName, index);
        todoItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(listName, index);
        todoItem.appendChild(deleteButton);

        container.appendChild(todoItem);
    });
}

// Function to open the modal for a specific list
function openListModal(listName) {
    modalTitle.textContent = listName; // Set the modal title to the list name
    renderTodos(listName, todoListContainer); // Render the todos for the selected list
    addTodoButton.onclick = () => addTodo(listName, todoInput.value, todoInput); // Set the add todo button functionality
    modal.classList.remove('hidden'); // Remove the hidden class to show the modal
}

// Function to close the modal
closeModal.onclick = () => {
    modal.classList.add('hidden'); // Add the hidden class to hide the modal
};

// Close the modal when clicking outside of it
window.onclick = (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
};

// Function to add a new list
function addList() {
    const listName = listInput.value.trim();
    if (listName && !todoLists[listName]) {
        todoLists[listName] = [];
        listInput.value = '';
        saveLists();
        renderLists();
    }
}

// Function to delete a list
function deleteList(listName) {
    const confirmDelete = confirm(`Are you sure you want to delete the list "${listName}"?`);
    if (confirmDelete) {
        delete todoLists[listName];
        saveLists();
        renderLists();
    }
}

// Function to add a new todo to a specific list
function addTodo(listName, todoText, inputElement) {
    const trimmedText = todoText.trim();
    if (trimmedText) {
        todoLists[listName].push({ text: trimmedText, completed: false }); // Add completed property
        inputElement.value = '';
        saveLists();
        renderTodos(listName, todoListContainer);
    }
}

// Function to mark a todo as completed
function toggleTodoCompletion(listName, index) {
    todoLists[listName][index].completed = !todoLists[listName][index].completed;
    saveLists();
    renderTodos(listName, todoListContainer);
}

// Function to edit a todo in a specific list
function editTodo(listName, index) {
    const newText = prompt('Edit your todo:', todoLists[listName][index].text);
    if (newText !== null) {
        todoLists[listName][index].text = newText.trim();
        saveLists();
        renderTodos(listName, todoListContainer);
    }
}

// Function to delete a todo from a specific list
function deleteTodo(listName, index) {
    const confirmDelete = confirm('Are you sure you want to delete this todo item?');
    if (confirmDelete) {
        todoLists[listName].splice(index, 1);
        saveLists();
        renderTodos(listName, todoListContainer);
    }
}

// Function to save lists to local storage
function saveLists() {
    localStorage.setItem('todoLists', JSON.stringify(todoLists));
}

// Event listeners
addListButton.addEventListener('click', addList);
document.addEventListener('DOMContentLoaded', renderLists);

// Add event listener for pressing "Enter" in the list input field
listInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && listInput.value.trim() !== '') {
        addList(); // Call the addList function when "Enter" is pressed
    }
});

// Add event listener for pressing "Enter" in the todo input field
todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && todoInput.value.trim() !== '') {
        addTodo(modalTitle.textContent, todoInput.value, todoInput); // Call the addTodo function when "Enter" is pressed
    }
});