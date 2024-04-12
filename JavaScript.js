let tasks = [];


// Fonction pour charger les tâches depuis le stockage local
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
        updateTaskCounts();
    }
}

// Fonction pour enregistrer les tâches dans le stockage local
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Appel de la fonction pour charger les tâches lors du chargement de la page
loadTasks();

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const statusSelect = document.getElementById('statusSelect');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const status = statusSelect.value;

    // Vérifier si le champ de saisie de la tâche est vide
    if (taskText === '') {
        alert("Veuillez entrer une tâche.");
        return;
    }

    // Vérifier si aucune date n'est sélectionnée ou si la date est antérieure à la date actuelle
    const currentDate = new Date();
    const selectedDate = new Date(dueDate);
    if (!dueDate || selectedDate >= currentDate) {
        alert("Veuillez choisir une date valide dans le futur.");
        return;
    }

    // Ajouter la tâche si elle passe les validations
    tasks.push({ text: taskText, dueDate: dueDate, status: status });
    displayTasks();
    taskInput.value = '';
    dueDateInput.value = '';
    saveTasks();
    updateTaskCounts();

    // Ajouter une animation d'ajout
    const taskList = document.getElementById('taskList');
    const newTaskItem = taskList.lastElementChild;
    newTaskItem.classList.add('add-animation');
    setTimeout(() => {
        newTaskItem.classList.remove('add-animation');
    }, 300);
}


function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskRow = document.createElement('tr');

        const taskTextCell = document.createElement('td');
        taskTextCell.textContent = task.text;

        const dueDateCell = document.createElement('td');
        dueDateCell.textContent = task.dueDate;

        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.innerHTML = `
            <option value="à faire" ${task.status === 'a faire' ? 'selected' : ''}>À faire</option>
            <option value="en cours" ${task.status === 'en cours' ? 'selected' : ''}>En cours</option>
            <option value="terminé" ${task.status === 'terminé' ? 'selected' : ''}>Terminé</option>
        `;
        statusSelect.addEventListener('change', () => updateTaskStatus(index, statusSelect.value));
        statusCell.appendChild(statusSelect);

        const actionCell = document.createElement('td');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.addEventListener('click', () => deleteTask(index));

        const modifyButton = document.createElement('button');
        modifyButton.textContent = 'Modifier';
        modifyButton.addEventListener('click', () => modifyTask(index));

        actionCell.appendChild(deleteButton);
        actionCell.appendChild(modifyButton);

        taskRow.appendChild(taskTextCell);
        taskRow.appendChild(dueDateCell);
        taskRow.appendChild(statusCell);
        taskRow.appendChild(actionCell);

        taskList.appendChild(taskRow);
    });
}

function deleteTask(index) {
    const taskList = document.getElementById('taskList');
    const taskItem = taskList.children[index];
    taskItem.classList.add('delete-animation'); // Ajouter la classe pour l'animation de suppression
    setTimeout(() => {
        tasks.splice(index, 1);
        displayTasks();
        saveTasks();
        updateTaskCounts();
    }, 300); // Attendre 300ms avant de supprimer réellement la tâche
}

function modifyTask(index) {
    const newTaskText = prompt('Entrez la nouvelle tâche :');
    if (newTaskText !== null && newTaskText.trim() !== '') {
        tasks[index].text = newTaskText.trim();
        displayTasks();
        saveTasks(); // Enregistrer les tâches après chaque modification
    }
}

function updateTaskStatus(index, newStatus) {
    tasks[index].status = newStatus;
    saveTasks(); // Enregistrer les tâches après chaque mise à jour de statut
    updateTaskCounts();
}

function updateTaskCounts() {
    const todoCount = tasks.filter(task => task.status === 'à faire').length;
    const inProgressCount = tasks.filter(task => task.status === 'en cours').length;
    const doneCount = tasks.filter(task => task.status === 'terminé').length;

    const countInfo = document.getElementById('countInfo');
    countInfo.textContent = `À faire: ${todoCount} | En cours: ${inProgressCount} | Terminé: ${doneCount}`;
}
