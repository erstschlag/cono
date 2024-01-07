let TOP_X = 5;
let connection = null;

function displayUsers(users, filteredColNames, showHeader) {
    // Extract value from table header. 
    let col = [];
    for (let i = 0; i < users.length; i++) {
        for (let key in users[i]) {
            if (col.indexOf(key) === -1 && !filteredColNames.includes(key)) {
                col.push(key);
            }
        }
    }

    // Create table.
    const table = document.createElement("table");

    if (showHeader) {
        // Create table header row using the extracted headers above.
        let tr = table.insertRow(-1);                   // table row.

        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th");      // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
    }

    // add json data to the table as rows.
    for (let i = 0; i < users.length; i++) {

        tr = table.insertRow(-1);

        for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            tabCell.innerHTML = users[i][col[j]];
        }
    }

    // Now, add the newly created table with json data, to a container.
    const divShowData = document.getElementById('data');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
}

function retrieveTopXNuggetHolders() {
    connection.sendStr("/app/topNuggetHolders", TOP_X);
}

function onTopNuggetHoldersReceived(data) {
    fixNuggetColData(data.content);
    displayUsers(data.content, ['id', 'weeklyLP', 'totalLP'], false);
}

function fixNuggetColData(content) {
    for (let user of content) {
        user.nuggets = user.nuggets.split(".")[0];
    }
}

function onUserAwardedReceived(data) {
    retrieveTopXNuggetHolders();
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/topNuggetHolders', onTopNuggetHoldersReceived);
    connection.subscribe('/topic/userAwarded', onUserAwardedReceived);
    retrieveTopXNuggetHolders();
}

$(function () {
    connection = Backend.connect(onBackendConnect);
});