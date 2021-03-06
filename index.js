
const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require('socket.io');
const io = new Server(server);
const router = require('./routes/index');
var listi=[];

const mongo = require('mongodb').MongoClient;
app.use('/', router);

mongo.connect('mongodb://127.0.0.1/skilaverkefni_4', {useUnifiedTopology: true}, function(err, db) {
	if (err) {
		throw err;
	}
	var chatdb = db.db("skilaverkefni_4");
    

    io.on('connection',(socket)=>{
        
        socket.on('join', (name)=>{
            dulnefni=['Anonymous Dinasaur','Anonymous Axolotl','Anonymous Kiwi','Anonymous Quokka','Anonymous Wombat','Anonymous Blobfish','Anonymous Dragon'];
            if (!name){
                socket.userName=dulnefni[Math.floor(Math.random()*7)];
            } else {
                socket.userName=name;
            }
            listi.push(socket.userName)
            io.emit('innskráðir breyttust',listi);
            
            io.emit('chat message',socket.userName+' has joined the chat.'); 

          chatdb.collection("messages").find({}).toArray(function(err,result){
            if(err) throw err;
            socket.emit('previous chat',result); 
            });  
        });
        
        socket.on('disconnect',()=>{
            for( var i = 0; i < listi.length; i++){ 
                if ( listi[i] === socket.userName) { 
                    listi.splice(i, 1); 
                }
            };
            io.emit('innskráðir breyttust',listi);    
            io.emit('chat message', socket.userName+' has left the chat.');
        });
        socket.on('user_typing',()=>{
            io.emit('user_typing',socket.userName);
        });
        socket.on('chat message', (msg)=>{
            chatdb.collection("messages").insertOne({user:socket.userName,msg:msg});
            io.emit('chat message',socket.userName+": "+msg);
        });
    });
});


server.listen(8080, () => {
    console.log('listening on *:8080');
});

