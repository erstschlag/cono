let stompClient;

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
    stompClient.send("/app/users", {}, JSON.stringify(pagination));
}

var pagination = {
    page:0,
    size:20,
    sortDirection:"DESC",
    sortFields:"weeklyLP"
};

function switchPage(relativeOffset) {
    pagination.page+=relativeOffset;
    if(pagination.page <= 0){
        pagination.page = 0;
    }
    retrieveUsers();
}

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/users', function (object) {
            var parsed = JSON.parse(object.body);
            displayUsers(parsed.content);
            displayNavigation(parsed);
        });
    });
}

$(function () {
    connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#retrieveUsers" ).click(function() { retrieveUsers(); });
    $( "#previousPage" ).click(function() { switchPage(-1); });
    $( "#nextPage" ).click(function() { switchPage(1); });
});