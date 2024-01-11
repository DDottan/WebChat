var socket;

function login() {
    var userId = document.getElementById('userId').value;
    var password = document.getElementById('password').value;

    var data = {
        type: "login",
        userId: userId,
        password: password
    };

    sendMessageToServer(data);
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
    var chatBox = document.getElementById('chatBox');
    var message = '';

    if (data.type === "error") {
        message = "오류: " + data.message;
    } else if (data.type === "loginOk") {
        message = "로그인 성공!";
    } else if (data.type === "userList") {
        message = "사용자 목록: " + data.users.join(", ");
    } else if (data.type === "chat") {
        // 채팅 메시지를 표시하는 경우
        message = data.userId + ": " + data.message;
    } else {
        message = JSON.stringify(data);
    }

    // 새 메시지를 textarea에 추가
    chatBox.value += message + '\n';
}


connectWebSocket();