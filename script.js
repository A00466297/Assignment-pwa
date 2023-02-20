async function registerServiceWorker() {
    // Register service worker
    if ('serviceWorker' in navigator) { // checking if the browser supports service workers
        window.addEventListener('load', function () { // when app loads, fire callback
            navigator.serviceWorker.register('/sw.js').then(function () { // register sw
                console.log('ServiceWorker registration successful');  // registration was successful
            }, function (err) {
                console.log('ServiceWorker registration failed', err); // registration failed
            });
        });
    }
}

async function main() {
    const form = document.querySelector('form');
    const task_name_input = document.querySelector("[name='tname']");
    const due_date_input = document.querySelector("[name='did']");
    const assigned_to_input = document.querySelector("[name='aid']");
    
    let taskInDB = []
    await loadTasksInDB();
    
    let displayTasksList = null
    displayTasksList = document.getElementById("Tasks") 
    displayTasksList.innerHTML = ''

    if (taskInDB && taskInDB.length !== 0) {
        taskInDB.forEach(task => {
            displayTask({tname: task.taskName, did: task.dueDate, aid: task.assignedTo});
        });
    }
    
    async function loadTasksInDB() {
        taskInDB = await getAllTasksFromDB()
    }
    function saveTaskToDB(task) {
        addNewTask(task.tname, task.did, task.aid);
    }
    
    function displayTask(task) {
        const taskDiv = document.createElement('div');
        taskDiv.id = task.id;
        const taskNameHeading = document.createElement('h1');
        taskNameHeading.innerHTML = task.tname;
        const dueDateText = document.createElement('p');
        dueDateText.innerHTML = task.did;
        const assignedToText = document.createElement('p');
        assignedToText.innerHTML = task.aid;
    
        taskDiv.appendChild(taskNameHeading);
        taskDiv.appendChild(dueDateText);
        taskDiv.appendChild(assignedToText);
        displayTasksList.appendChild(taskDiv);
        
        task_name_input.value = '';
        due_date_input.value = '';
        assigned_to_input.value = '';
    }

    // Events
    form.onsubmit = (event) => {
        event.preventDefault();
        saveTaskToDB({tname: task_name_input.value, did: due_date_input.value, aid: assigned_to_input.value});
        displayTask({tname: task_name_input.value, did: due_date_input.value, aid: assigned_to_input.value});
    }
}

registerServiceWorker()
main()