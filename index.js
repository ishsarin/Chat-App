//This is the serve connection(Node connection)

const express = require('express')
const app = express();
const server = require('http').createServer(app)
const io  = require('socket.io')(server)
const users ={}
const path = require('path')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')))



app.get('/',(req,res)=>{
    res.render('index')
})

    io.on('connection',socket=>{
        socket.on('new-user-joined',name=>{
            
            users[socket.id] = name;
            socket.broadcast.emit('user-joined',name);
        })
        socket.on('send',message=>{
            socket.broadcast.emit('receive',{message:message, name:users[socket.id]})
        })
        
        
    
        

        socket.on('disconnect',message=>{
            socket.broadcast.emit('left',users[socket.id])
            delete users[socket.id];
        })
    })

    const PORT = process.env.PORT || 3001
server.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`);
})