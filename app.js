const express = require("express");
const WebSocket = require("ws");
const http = require('http');
const url = require("url");
const path = require("path");
const room = require("./room");

const app = express();
app.set('views',path.join(__dirname,'views'));

const server = http.createServer(app);

const javascriptRoom = new WebSocket.Server({noServer:true});
const nodeRoom = new WebSocket.Server({noServer:true});
const angularRoom = new WebSocket.Server({noServer:true});
const reactRoom = new WebSocket.Server({noServer:true});
const electronRoom = new WebSocket.Server({noServer:true});

javascriptRoom.on('connection',(ws,request,user)=>{
    room(javascriptRoom,ws,request,user);
    
})

nodeRoom.on('connection',(ws,request,user)=>{
    room(nodeRoom,ws,request,user);
})

angularRoom.on('connection',(ws,request,user)=>{
    room(angularRoom,ws,request,user);
})

reactRoom.on('connection',(ws,request,user)=>{
    room(reactRoom,ws,request,user);
})

electronRoom.on('connection',(ws,request,user)=>{
    room(electronRoom,ws,request,user);
})

app.use(express.static('public'));

app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
})


server.on("upgrade",(req,socket,head)=>{
    const roomName = url.parse(req.url).pathname.split('/')[1];
    const userName = decodeURIComponent(url.parse(req.url).query);

    // console.log(roomName.split('/')[1]);

    let client = {
        id:Math.floor(Math.random()*1000),
        name: userName,
        room:roomName
    }

    if(roomName === "javascript"){
        javascriptRoom.handleUpgrade(req,socket,head,(ws)=>{
            javascriptRoom.emit('connection',ws,req,client);
        })
    }
    
    else if(roomName === "node"){
        nodeRoom.handleUpgrade(req,socket,head,(ws)=>{
            nodeRoom.emit('connection',ws,req,client);
        })
    }

    else if(roomName === "angular"){
        angularRoom.handleUpgrade(req,socket,head,(ws)=>{
            angularRoom.emit('connection',ws,req,client);
        })
    }

    else if(roomName === "react"){
        reactRoom.handleUpgrade(req,socket,head,(ws)=>{
            reactRoom.emit('connection',ws,req,client);
        })
    }

    else if(roomName === "electron"){
        electronRoom.handleUpgrade(req,socket,head,(ws)=>{
            electronRoom.emit('connection',ws,req,client);
        })
    }

    else{
        socket.destroy();
    }
})

const port = process.env.PORT || 3000;
server.listen(port,()=>{
    console.log("Server started");
})