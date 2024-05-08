// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
// salvar tarefa
const saveTodo = (task, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = task;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ task, done });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

// trocar class hide
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

// atualizar
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
    }
  });
};

// pesquisar
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    const normalizedSearch = search.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none";
    }
  });
};

// filtrar
const filterTodos = (filterSelect) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterSelect) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) => {
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none");
      });
      break;

    case "todo":
      todos.forEach((todo) => {
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none");
      });
      break;

    default:
      break;
  }
};

// Eventos
// salvar tarefa
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

// botões done/edit/remove
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocasStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle);
  }
});

// cancelar edit
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// editar tarefa
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newInputValue = editInput.value;

  if (newInputValue) {
    updateTodo(newInputValue);
  }

  editTodoLocalStorage(newInputValue);

  toggleForms();
});

// pesquisar tarefa
searchInput.addEventListener("keyup", (e) => {
  const searchTodo = e.target.value;

  getSearchTodos(searchTodo);
});

// apagar pesquisa
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

// filtrar tarefa
filterBtn.addEventListener("change", (e) => {
  const filterSelect = e.target.value;

  filterTodos(filterSelect);
});

// Local storage
// pegar dados
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

// salvar dados
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

// carregar dados
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.task, todo.done, 0);
  });
};

// remover dados
const removeTodoLocalStorage = (todoTask) => {
  const todos = getTodosLocalStorage();

  const filteredTodo = todos.filter((todo) => todo.task !== todoTask);

  localStorage.setItem("todos", JSON.stringify(filteredTodo));
};

// atualizar status
const updateTodoStatusLocasStorage = (todoTask) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.task === todoTask ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

// editar dados
const editTodoLocalStorage = (editTask) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.task === oldInputValue ? (todo.task = editTask) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
