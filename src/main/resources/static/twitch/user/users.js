let connection = null;

var pagination = {
    page:0,
    size:20,
    sortDirection:"DESC",
    sortFields:"weeklyLP"
};

var isLPCollectionEnabled;

function displayUsers(users) {
    // Extract value from table header. 
    let col = [];
    for (let i = 0; i < users.length; i++) {
        for (let key in users[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // Create table.
    const table = document.createElement("table");

    // Create table header row using the extracted headers above.
    let tr = table.insertRow(-1);                   // table row.

    for (let i = 0; i < col.length; i++) {
        let th = document.createElement("th");      // table header.
        th.innerHTML = col[i];
        tr.appendChild(th);
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
    const divShowData = document.getElementById('showData');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
}

function displayNavigation(parsed) {
    const divShowData = document.getElementById('showNavigation');
    divShowData.innerHTML = "" + parsed.totalElements;
}

function retrieveUsers() {
    this.connection.sendObject("/app/users", pagination);
}

function retrieveUsersByNameLike(search) {
    this.connection.sendObject("/app/usersWithNameLike", {search: search,
        pageableRequest: pagination});
}

function retrieveLPCollectionStatus() {
    this.connection.sendObject("/app/users/isLPCollectionEnabled", "");
}

function enableLPCollection(enable) {
    this.connection.sendObject("/app/users/enableLPCollection", enable);
}

function switchPage(relativeOffset) {
    pagination.page+=relativeOffset;
    if(pagination.page <= 0){
        pagination.page = 0;
    }
    retrieveUsers();
}

function modifyUserCredits(userId, amount) {
    if(amount === 0){
        return;
    }
    if(amount > 0) {
        Backend.connection.awardUser(userId, amount, 'Erst wants it!',
                () => {});
    } else {
        Backend.connection.chargeUser(userId, -amount, 'Erst wants it!',
                () => {});
    }
    retrieveUsers();
}


function onBackendConnect(connection) {
    this.connection = connection;
    connection.subscribe('/topic/users', function (object) {
            displayUsers(object.content);
            displayNavigation(object);
        });
    connection.subscribe('/topic/isLPCollectionEnabled', function (object) {
            isLPCollectionEnabled = object;
            var enableButton = document.getElementById('enableLPCollection');
            if(isLPCollectionEnabled) {
                enableButton.textContent = 'disable';
            }else{
                enableButton.textContent = 'enable';
            }
        });
    retrieveUsers();
    retrieveLPCollectionStatus();
}

$(function () {
    Backend.connect(onBackendConnect);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#retrieveUsers" ).click(function() { retrieveUsers(); });
    $( "#previousPage" ).click(function() { switchPage(-1); });
    $( "#nextPage" ).click(function() { switchPage(1); });
    $( "#enableLPCollection" ).click(function() { enableLPCollection(!isLPCollectionEnabled); });
    $( "#modifyUserCredits" ).click(function() { modifyUserCredits($("#modifyUserCreditsUserId").val(), parseFloat($("#modifyUserCreditsAmount").val())); });
    $( "#searchUserByName" ).click(function() { retrieveUsersByNameLike($("#userNameSearch").val()); });
});