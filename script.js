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
    
    console.log("begin")

    // Read the current form
    const form = document.querySelector('form');
    const taskNameInput = document.querySelector("[name='tname']");
    const dueDateInput = document.querySelector("[name='did']");
    const assignedToInput = document.querySelector("[name='aid']");
    

    let dbPendingTasks = []
    let dbCompletedTasks = []
    await loadTasksFromDB();
    let pendingTasksList = []
    let completedTasksList = []
    let pendingTasksListDOM = null
    let completedTasksListDOM = null
    updateDOM()
    

    // Read the tasks in the database
    async function loadTasksFromDB() {
        dbPendingTasks = await getPendingTasksFromDB()
        dbCompletedTasks = await getCompletedTasksFromDB()
    }
    
    // Update the DOM
    function updateDOM () {
        pendingTasksList = []
        completedTasksList = []
        pendingTasksListDOM = document.getElementById("pendingTasks")
        completedTasksListDOM = document.getElementById("completedTasks") 
        pendingTasksListDOM.textContext = ''
        completedTasksListDOM.textContext = ''

        // For any pending task in database that is not in the DOM add it to DOM
        if (dbPendingTasks) {
            dbPendingTasks.forEach(dbPendingTask => {
                addTaskToDOM(dbPendingTask);
                pendingTasksList.push(dbPendingTask)
            });
        }
        // For any completed task in database that is not in the DOM add it to DOM
        if (dbCompletedTasks) {
            dbCompletedTasks.forEach(dbCompletedTask => {
                addTaskToDOM(dbCompletedTask);
                completedTasksList.push(dbCompletedTask)
            });
        }
    }

    function addTaskToDB(task) {
        addnewTask(task.tname, task.did, task.aid, task.isCompleted);
    }
    
    async function addTaskToDOM(task) {
        const div = document.createElement('div');
        div.classList.add("taskClass");
        div.id = task.id;
    
        const h1TaskName = document.createElement('h1');
        h1TaskName.classList.add("tasktnameClass");
        h1TaskName.innerHTML = task.taskName;
        
        const pDueDate = document.createElement('p');
        pDueDate.classList.add("taskdidClass");
        pDueDate.classList.add("inlineBlock");
        pDueDate.innerHTML = task.dueDate;
    
        const pAssignedTo = document.createElement('p');
        pAssignedTo.classList.add("taskaidClass");
        pAssignedTo.classList.add("inlineBlock");
        pAssignedTo.innerHTML = task.assignedTo;
        
        let checkboxChecked = false;
        const checkBoxIsCompleted = document.createElement('input');
        checkBoxIsCompleted.classList.add("inlineBlock");
        checkBoxIsCompleted.type = "checkbox";
        checkBoxIsCompleted.checked = checkboxChecked;
        checkBoxIsCompleted.id = task.id + "id";
        checkBoxIsCompleted.addEventListener('change', function() {
            onCheckBoxChange(checkBoxIsCompleted.id, this.checked)
        });
    
        div.appendChild(h1TaskName);
        div.appendChild(pDueDate);
        div.appendChild(pAssignedTo);
        div.appendChild(checkBoxIsCompleted);
    
        if (task.isCompleted === "true") {
            completedTasksListDOM.appendChild(div);
        } else {
            pendingTasksListDOM.appendChild(div);
        }
        taskNameInput.value = '';
        dueDateInput.value = '';
        assignedToInput.value = '';
    }

    async function onCheckBoxChange(taskid, isCompleted) {
        taskIdVal = taskid.split('id')
        if(taskIdVal && taskIdVal.length !== 0) {
            return await UpdateTaskStatus(taskIdVal[0], isCompleted).then(
                loadTasksFromDB()
            ).then(
                updateDOM()
            )
        }

    }

    async function UpdateTaskStatus(id, isCompleted) {
        if (isCompleted) {
            return await markTaskCompleted(id)
        } else {
            return await markTaskPending(id)
        }
    }

    // Events
    form.onsubmit = (event) => {
        event.preventDefault();
        addTaskToDB({tname: taskNameInput.value, did: dueDateInput.value, aid: assignedToInput.value});
        addTaskToDOM({tname: taskNameInput.value, did: dueDateInput.value, aid: assignedToInput.value});
    }
}

registerServiceWorker()
main()