let backend = null;

var pagination = {
    page:0,
    size:25,
    sortDirection:"DESC",
    sortFields:"weeklyLP"
};

var isLPCollectionEnabled;

function toggleSort(colName) {
    if(pagination.sortFields === colName){
        if (pagination.sortDirection === "DESC") {
            pagination.sortDirection = "ASC";
        } else{
            pagination.sortDirection = "DESC";
        }
    }else{
        pagination.sortFields = colName;
        pagination.sortDirection = "DESC";
    }
    retrieveUsers();
};

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
    table.className = "table table-sm table-bordered table-hover table-dark";
    // Create table header row using the extracted headers above.
    let tr = table.insertRow(-1);                   // table row.

    for (let i = 0; i < col.length; i++) {
        let th = document.createElement("th");      // table header.
        th.className = "thead-dark";
        th.onclick = function() {
           toggleSort(col[i]);
        };
        if(col[i] === pagination.sortFields) {
            th.innerHTML = col[i] + (pagination.sortDirection === "DESC"? " v" : " ^");
        }else{
            th.innerHTML = col[i];
        }
        tr.appendChild(th);
    }

    // add json data to the table as rows.
    for (let i = 0; i < users.length; i++) {

        tr = table.insertRow(-1);
        tr.onclick = function() {
            showModifyUserDialog(users[i][col[0]]);
        };

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

function showModifyUserDialog(userId) {
    $("#modifyUserCreditsUserId").val(userId);
    document.getElementById("modifyUserDialog").showModal();
}

function retrieveUsers() {
    if($("#userNameSearch").val() === ""){
        backend.sendObject("/app/users", pagination);
    }else{
        retrieveUsersByNameLike($("#userNameSearch").val());
    }
}

function retrieveUsersByNameLike(search) {
    backend.sendObject("/app/usersWithNameLike", {search: search,
        pageableRequest: pagination});
}

function retrieveLPCollectionStatus() {
    backend.sendObject("/app/users/isLPCollectionEnabled", "");
}

function retrieveWeeklyLPSum() {
    backend.sendObject("/app/users/weeklyLPSum", "");
}

function resetWeeklyLP() {
    document.getElementById("resetWeeklyLPConfirmationDialog").close();
    backend.sendObject("/app/users/resetWeeklyLP", "");
}

function showResetWeeklyConfirmationDialog() {
    document.getElementById("resetWeeklyLPConfirmationDialog").showModal();
}

function enableLPCollection(enable) {
    backend.sendObject("/app/users/enableLPCollection", enable);
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
        backend.awardUser(userId, amount, 'Erst wants it!',
                () => {retrieveUsers();});
    } else {
        backend.chargeUser(userId, -amount, 'Erst wants it!',
                () => {retrieveUsers();});
    }
    document.getElementById("modifyUserDialog").close();
}


function onBackendConnect(backend) {
    backend.subscribe('/topic/users', function (object) {
            displayUsers(object.content);
        });
    backend.subscribe('/topic/isLPCollectionEnabled', function (object) {
            isLPCollectionEnabled = object;
            var enableButton = document.getElementById('enableLPCollection');
            if(isLPCollectionEnabled) {
                enableButton.className = "btn btn-success";
                enableButton.textContent = 'disable';
            }else{
                enableButton.className = "btn btn-danger";
                enableButton.textContent = 'enable';
            }
        });
    backend.subscribe('/topic/weeklyLPSum', function (object) {
        $("#totalWeeklyLP").html(Math.round(parseInt(object) / 20) + 'm ISK');
    });    
    retrieveUsers();
    retrieveLPCollectionStatus();
    retrieveWeeklyLPSum();
}

$(() => {
    backend = new Backend(onBackendConnect);
    $( "#previousPage" ).click(function() { switchPage(-1); });
    $( "#nextPage" ).click(function() { switchPage(1); });
    $( "#enableLPCollection" ).click(function() { enableLPCollection(!isLPCollectionEnabled); });
    $( "#requestResetWeeklyLP" ).click(function() { showResetWeeklyConfirmationDialog(); });
    $( "#resetWeeklyLP" ).click(function() { resetWeeklyLP(); });
    $( "#closeResetWeeklyLPButton" ).click(function() { document.getElementById("resetWeeklyLPConfirmationDialog").close(); });
    $( "#modifyUserCredits" ).click(function() { modifyUserCredits($("#modifyUserCreditsUserId").val(), parseFloat($("#modifyUserCreditsAmount").val())); });
    $( "#cancelModifyUserDialog" ).click(function() { document.getElementById("modifyUserDialog").close(); });
    $( "#searchUserByName" ).click(function() { retrieveUsers(); });
});