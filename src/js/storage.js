function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function deleteTodo(index) {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
}

export { saveTodos, getTodos, deleteTodo };