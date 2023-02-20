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
    

    let TasksfromDB = []
    await loadTasksFromDB();
    let TasksList = []
    let UITasksListDOM = null
    updateDOM()
    

    // Read the tasks in the database
    async function loadTasksFromDB() {
        TasksfromDB = await getAllTasksFromDB()
    }
    
    // Update the DOM
    function updateDOM () {
        TasksList = []
        UITasksListDOM = document.getElementById("Tasks") 
        UITasksListDOM.textContext = ''


        // For any pending task in database that is not in the DOM add it to DOM
        if (TasksfromDB) {
            TasksfromDB.forEach(x => {
                addTaskToDOM(x);
                TasksList.push(x)
            });
        }
    }

    function addTaskToDB(task) {
        addnewTask(task.tname, task.did, task.aid);
    }
    
    async function addTaskToDOM(task) {
        const div = document.createElement('div');
        div.id = task.id;
    
        const h1TaskName = document.createElement('h1');
        h1TaskName.innerHTML = task.tname;
        
        const pDueDate = document.createElement('p');
        pDueDate.innerHTML = task.did;
    
        const pAssignedTo = document.createElement('p');
        pAssignedTo.innerHTML = task.aid;
    
        div.appendChild(h1TaskName);
        div.appendChild(pDueDate);
        div.appendChild(pAssignedTo);
        UITasksListDOM.appendChild(div);
        
        taskNameInput.value = '';
        dueDateInput.value = '';
        assignedToInput.value = '';
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