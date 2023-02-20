var db = new Dexie("ToDoList");

db.version(1).stores({
    tasks: '++id, taskName, dueDate, assignedTo',
});


async function getAllTasksFromDB() {
    if (db && db.tasks) { // check if db and the students table are created
        return await db.tasks.toArray().then((data) => {
            return data
        })
    } else {
        return undefined
    }
}

function addnewTask(taskName, dueDate, assignedTo) {
    db.tasks.put({ taskName, dueDate, assignedTo})
        .then(() => true)
        .catch(err => {
            alert("Ouch... " + err);
        });
}


