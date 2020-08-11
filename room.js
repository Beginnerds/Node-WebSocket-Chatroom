const WebSocket = require('ws');

module.exports = (currentRoom,ws,request,user) =>{
    // currentRoom.users = [];
    // currentRoom.users.push(user);
    function heartBeat(){
        this.isAlive = true;
    }
    ws.isAlive = true;
    ws.on('pong',heartBeat);

    currentRoom.clients.forEach(client=>{
        if(client == ws){
            client.user = user;
        }
    })

    let allUsers = [];

    currentRoom.clients.forEach(client=>{
        allUsers.push(client.user.name);
    })

    currentRoom.clients.forEach(client =>{
        client.send(message(true,`${user.name} has joined the chat`,null,allUsers));
    })

    function noop(){}

    const interval = setInterval(function ping() {
        currentRoom.clients.forEach(function each(ws) {
          if (ws.isAlive === false) return ws.terminate();
       
          ws.isAlive = false;
          ws.ping(noop);
        });
      }, 5000);

    ws.on('close',()=>{
        console.log('closed');
        allUsers = allUsers.filter(user=>{
            user != ws.user.name;
        })
        currentRoom.clients.forEach(client =>{
            // allUsers = allUsers.filter(user=>{
            //     user != client.user.name;
            // })
            console.log(allUsers);
            client.send(message(true,`${ws.user.name} has left the chat`,null,allUsers));
        })
        clearInterval(interval);
    })

    ws.on('message',data =>{
        currentRoom.clients.forEach(client =>{
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(message(false,data,ws.user));
                console.log("sent");
            }
        })
    })

}

function message(isNotif,message,user=null,metaData){
    if(user){
        return JSON.stringify({isNotif,message,sender:user.name})
    }
    else{
        return JSON.stringify({isNotif,message,users:metaData});
    }
}