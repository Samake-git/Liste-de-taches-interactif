// Déclaration d'encodage UTF-8
// Ceci assure que les caractères spéciaux, y compris les accents, sont correctement interprétés


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
    const prioritySelect = document.getElementById('prioritySelect'); // Nouveau
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const status = statusSelect.value;
    const priority = prioritySelect.value; // Nouveau

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
    tasks.push({ text: taskText, dueDate: dueDate, status: status, priority: priority }); // Modifié
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
            <option value="à faire" ${task.status === 'à faire' ? 'selected' : ''}>À faire</option>
            <option value="en cours" ${task.status === 'en cours' ? 'selected' : ''}>En cours</option>
            <option value="terminé" ${task.status === 'terminé' ? 'selected' : ''}>Terminé</option>
        `;
        statusSelect.addEventListener('change', () => updateTaskStatus(index, statusSelect.value));
        statusCell.appendChild(statusSelect);

        const priorityCell = document.createElement('td'); // Nouveau
        const prioritySelect = document.createElement('select'); // Nouveau
        prioritySelect.innerHTML = `
            <option value="faible" ${task.priority === 'faible' ? 'selected' : ''}>Faible</option>
            <option value="moyenne" ${task.priority === 'moyenne' ? 'selected' : ''}>Moyenne</option>
            <option value="élevée" ${task.priority === 'élevée' ? 'selected' : ''}>Élevée</option>
        `;
        prioritySelect.addEventListener('change', () => updateTaskPriority(index, prioritySelect.value)); // Nouveau
        priorityCell.appendChild(prioritySelect); // Nouveau

        const actionCell = document.createElement('td');
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt'; // Remplacez cette classe par celle de votre icône de suppression
        deleteIcon.title = 'Supprimer';
        deleteIcon.addEventListener('click', () => deleteTask(index));
        const modifyIcon = document.createElement('i');
        modifyIcon.className = 'fas fa-edit'; // Remplacez cette classe par celle de votre icône de modification
        modifyIcon.title = 'Modifier';
        modifyIcon.addEventListener('click', () => modifyTask(index));
        actionCell.appendChild(deleteIcon);
        actionCell.appendChild(modifyIcon);
        taskRow.appendChild(taskTextCell);
        taskRow.appendChild(dueDateCell);
        taskRow.appendChild(statusCell);
        taskRow.appendChild(priorityCell); // Nouveau
        taskRow.appendChild(actionCell);
        taskList.appendChild(taskRow);
    });
}

function updateTaskPriority(index, newPriority) {
    tasks[index].priority = newPriority;
    saveTasks(); // Enregistrer les tâches après chaque mise à jour de priorité
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
    const task = tasks[index];

    // Demander à l'utilisateur de saisir les modifications
    const newTaskText = prompt('Entrez la nouvelle tâche :', task.text);
    const newDueDate = prompt('Entrez la nouvelle date d\'échéance :', task.dueDate);
    const newStatus = prompt('Entrez le nouveau statut (à faire, en cours, terminé) :', task.status);
    const newPriority = prompt('Entrez la nouvelle priorité (faible, moyenne, élevée) :', task.priority);

    // Vérifier si l'utilisateur a annulé la modification ou laissé les champs vides
    if (newTaskText === null || newTaskText.trim() === '' ||
        newDueDate === null || newDueDate.trim() === '' ||
        newStatus === null || newStatus.trim() === '' ||
        newPriority === null || newPriority.trim() === '') {
        return; // Sortir de la fonction sans effectuer de modification
    }

    // Mettre à jour la tâche avec les nouvelles valeurs
    tasks[index].text = newTaskText.trim();
    tasks[index].dueDate = newDueDate.trim();
    tasks[index].status = newStatus.trim();
    tasks[index].priority = newPriority.trim();

    // Actualiser l'affichage et enregistrer les modifications
    displayTasks();
    saveTasks();
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
