const mainContainer = document.querySelector('.main-container');
const name = document.getElementById('name')
const room = document.querySelector('.dropdown');
const joinButton = document.querySelector('.join-button');

const maiChatContainer = document.querySelector('.main-chat-container');
const roomTitle = document.querySelector('.room-title');
const hamburger = document.querySelector('.hamburger');
const metaContainer = document.querySelector('.meta-container');
const messageArea = document.querySelector('.message-area');
const message = document.querySelector('.message');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-img');
const otherRooms = document.querySelectorAll('.list li');
let onlineUsersList = document.querySelector('#users');

let sendListener;
let socket;
let currentUser;

otherRooms.forEach(room=>{
    room.addEventListener('click',switchRooms);
})

hamburger.addEventListener('click',(e)=>{
    metaContainer.classList.toggle('meta-appear')
})

name.addEventListener('input',(e)=>{
    if(name.value.length > 2){
        joinButton.disabled = false;
        joinButton.classList.remove('disabled');
    }

    else{
        joinButton.disabled = true;
        joinButton.classList.add('disabled');
    }
})

joinButton.addEventListener('click',(e)=>{
    let userName = name.value;
    let roomName = room.value;
    let wsURL = 'ws://'+ window.location.href.split('//')/[1];
    socket = new WebSocket(`ws://${window.location.host}/${roomName}?${userName}`);

    configSocket(socket,roomName,userName);
})

function appendMessage(isNotif,message,self=false,sender=null){
    let messageDiv = document.createElement('p');
    let senderDiv = document.createElement('div');
    messageDiv.innerHTML = message;

    if(isNotif){
        messageDiv.classList.add('notification');
    }
    else{
        messageDiv.classList.add('message');
    }
    if(self){
        messageDiv.classList.add('self');
    }
    if(sender){
        senderDiv.classList.add('sender');
        senderDiv.innerHTML = sender;
        messageDiv.append(senderDiv);
    }
    messageArea.append(messageDiv);
}

function sendMessage(){
    if(messageInput.value.length > 0){
        appendMessage(false,messageInput.value,true);
        socket.send(messageInput.value);
        messageInput.value = "";
    }
}

function showOnlineUsers(userArray){
    userArray.forEach(user =>{
        let li = document.createElement('li');
        li.innerHTML = user;
        onlineUsersList.append(li);
    })
}

function switchRooms(e){
    const roomName = e.target.dataset.room;
    messageArea.innerHTML = "";
    onlineUsersList.innerHTML ="";
    sendButton.removeEventListener('click',sendMessage);
    socket.close();
    socket = new WebSocket(`wss://localhost:3000/${roomName}?${currentUser}`);
    configSocket(socket,roomName,currentUser);
}

function configSocket(socket,roomName,userName){
    socket.onopen = (e) =>{
        currentUser = userName;
        mainContainer.style.display = "none";
        maiChatContainer.style.display = "grid";

        roomTitle.innerHTML = roomName;
    }

    socket.onmessage = e =>{
        // alert(e.data);
        let received = JSON.parse(e.data);
        console.log(received);
        appendMessage(received.isNotif,received.message,false,received.sender);
        if(received.users){
            onlineUsersList.innerHTML = "";
            showOnlineUsers(received.users);
        }
    }

    sendButton.addEventListener('click',sendMessage)
}