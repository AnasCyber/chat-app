const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT || 8000
const io = require('socket.io')(http)

const users = {}

app.use(express.static(__dirname + '/public'))
console.log(__dirname + '/public')

app.use('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

io.on('connection',(socket)=>{
    socket.on('new-user-joined',(data)=>{
        users[socket.id] = data
        socket.broadcast.emit('user-joined',data)
    })
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg)
    })
    socket.on('disconnect',()=>{
        if (users[socket.id] != undefined) {
            socket.broadcast.emit('disconnect-user', users[socket.id])
            delete users[socket.id]
        }
    })
    socket.on('disconnect-user',(user)=>{
        socket.broadcast.emit('disconnect-user', users[socket.id])
        delete users[socket.id]
    })
})

http.listen(port,()=>{
    console.log("server is listening at port: "+port)
})