var socket;
var users = []; // 사용자 목록을 저장하는 배열


function login() {
    var userId = document.getElementById('userId').value;

    var data = {
        type: "login",
        userId: userId,
        password: "1234"
    };

    sendMessageToServer(data);
}

function handleUserIdKeyPress(event) {
    if (event.key === 'Enter') {
        login();
    }
}

function sendMessage() {
    var userId = document.getElementById('userId').value;
    var message = document.getElementById('message').value;

    var data = {
        type: "chat",
        userId: userId,
        message: message
    };

    sendMessageToServer(data);
}

function connectWebSocket() {
    socket = new WebSocket('ws://127.0.0.1:8080/chat');

    socket.onopen = function (event) {
        console.log("웹소켓 연결됨:", event);
    };

    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        handleResponse(data);
    };

    socket.onerror = function (error) {
        console.log("웹소켓 에러 발생:", error);
    };

    socket.onclose = function (event) {
        console.log("웹소켓 연결 종료됨:", event);
    };
}

function sendMessageToServer(data) {
    if (socket.readyState !== WebSocket.OPEN) {
        console.log("웹소켓이 연결되지 않았습니다.");
        return;
    }

    socket.send(JSON.stringify(data));
}

function handleResponse(data) {
    console.log("서버에서 받은 메시지:", data);

    var chatBox = document.getElementById('chatBox');
    var userListBox = document.getElementById('userList');
    var message = '';

    if (data.type === "error") {
        message = "오류: " + data.message;
    } else if (data.type === "loginOk") {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('chatScreen').style.display = 'block';
    } else if (data.type === "userIn") {
        if (!users.some(user => user.userId === data.user.userId)) {
            users.push(data.user);
        }
        updateUserList(userListBox);
    } else if (data.type === "userOut") {
        users = users.filter(user => user.userId !== data.userId);
        updateUserList(userListBox);
    } else if (data.type === "userList") {
        data.users.forEach(newUser => {
            if (!users.some(user => user.userId === newUser.userId)) {
                users.push(newUser);
            }
        });
        updateUserList(userListBox);
    } else if (data.type === "chat") {
        message = data.userId + ": " + data.message;
    }

    chatBox.value += message + '\n';
}

function updateUserList(userListBox) {
    userListBox.value = users.map(user =>
        user.userId + (user.userLevel !== 0 ? " (관리자)" : "")
    ).join('\n');
}

connectWebSocket();
