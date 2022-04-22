const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');
var listi=[];

const mongo = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/', (req,res)=>{
    var password=req.body.password;
    res.redirect('/'+password);
});

app.get('/Password',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

app.get('/*',(req,res) =>{
    res.sendFile(__dirname+'/adgangur_ohemill.html');
});
mongo.connect('mongodb://127.0.0.1/skilaverkefni4', {useUnifiedTopology: true}, function(err, db) {
	if (err) {
		throw err;
	}
	var chatdb = db.db("skilaverkefni4");

    io.on('connection',(socket)=>{
        socket.on('join', (name)=>{
            dulnefni=['Anonymouse Dinasaur','Anonymous Axolotl','Anonymous Kiwi','Anonymous Quokka','Anonymouse Wombat','Anonymouse Blobfish','Anonymouse Dragon'];
            if (!name){
                socket.userName=dulnefni[Math.floor(Math.random()*7)];
            } else {
                socket.userName=name;
            }
            listi.push(socket.userName)
            io.emit('innskráðir breyttust',listi);
            io.emit('chat message',socket.userName+' has joined the chat.'); 
        });
        
        socket.on('disconnect',()=>{
            for( var i = 0; i < listi.length; i++){ 
        
                if ( listi[i] === socket.userName) { 
            
                    listi.splice(i, 1); 
                }
            
            };
            io.emit('innskráðir breyttust',listi);    
            io.emit('chat message', socket.userName+' has left the chat.')
            // io.emit('chat message',name+' has left the chat'); 
        });
        socket.on('user_typing',()=>{
            io.emit('user_typing',socket.userName);
        });
        socket.on('chat message', (msg)=>{
            chatdb.collection("messages").insertOne({msg:socket.userName+' wrote: '+msg});
            io.emit('chat message',socket.userName+": "+msg);
        });
    });
});


server.listen(8080, () => {
    console.log('listening on *:3000');
});

