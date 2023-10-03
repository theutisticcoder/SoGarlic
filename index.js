const express = require('express');
const fs = require("fs");
var rooms = [];
var roompass = [];
var clientrooms = [];
var pusher = [];
var guess = [];
var playercount = [];
var x = 0;
var mainsocket = [];
var roomnumber = 0;
var finals= 0;
var answers = [];
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var words = [];
app.use(express.static(__dirname))
const allFileContents = fs.readFileSync('words.txt', 'utf-8');
var arrayofwords = Array.from(allFileContents.split(/\r?\n/));
var people = 0;
var clients;	
rooms[0] = [];
console.log(rooms)
io.on('connection', (socket) => {
	console.log(Array.from(socket.rooms)[1]);
  console.log('a user connected');
	
socket.on("room", room=> {
	socket.on("password", pass=> {
		if(roompass.includes({room: room, password: pass})){
			socket.emit("already");
		}
		else{
		roompass.push({room: room, password: pass});
		socket.join(room);
		mainsocket.push({room: room, socket: socket});
		console.log(roompass);
		}
	})
})
	socket.on("roomguess", room=> {
	socket.on("passwordguess", pass=> {
		if(roompass.findIndex(e => e.room === room) === roompass.findIndex(e => e.password === pass) && roompass.findIndex(e => e.password === pass)>=0){
			if(clientrooms.findIndex(e => e.room === room)<0){
					socket.join(room);
			mainsocket[mainsocket.findIndex(index=> index.room === room)].socket.emit("game", room);
			}
			else{
				socket.emit("late");
			}
		}
		else{
			socket.emit("nope");
		}
	})
})
	async function getsockets(room){
			clients = await io.in(Array.from(socket.rooms)[1]).fetchSockets();
				clientrooms.push({room: room, client: clients, count: clients.length, on: clients.length - 1});
			console.log(clientrooms);
		io.to(room).emit("gamestart");
		
clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].client[clientrooms[clientrooms.findIndex(r=> r.room === Array.from(socket.rooms)[1])].on].emit("start");
		console.log(clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].client);
		};
	socket.on("startgame", room=> {
		getsockets(room);
	})
	
	
	socket.on("addcard",()=> {
		for(let i = 0; i<4; i++){
			words.push(arrayofwords[Math.floor(Math.random() * arrayofwords.length)]);
		}
		console.log(words);
		socket.emit("words", words);
		words = [];
	});

	socket.on("cards", cards => {

		 socket.broadcast.to(Array.from(socket.rooms)[1]).emit("extra");
		socket.broadcast.to(Array.from(socket.rooms)[1]).emit("getcards", cards);
});
	socket.on("keys", keys => {
		socket.broadcast.to(Array.from(socket.rooms)[1]).emit("clues", keys);
	});
	socket.on("top", top=> {
	answers.push(top);
	if(answers.length === 4) rooms[Array.from(socket.rooms)[1]].push({answer: answers, room: Array.from(socket.rooms)[1]});
});
socket.on("left", top=> {
	answers.push(top);
	console.log(Array.from(socket.rooms)[1]);
	if(answers.length === 4) rooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])][0] = {answer: answers, room: Array.from(socket.rooms)[1]};
	console.log(rooms);
	console.log(answers);
	answers = [];
	console.log(clientrooms.findIndex(r=> r.room === Array.from(socket.rooms)[1]))
});
socket.on("bottom", top=> {
	answers.push(top);
	if(answers.length === 4){ rooms[Array.from(socket.rooms)[1]].push({answer: answers, room: Array.from(socket.rooms)[1]});
	answers = [];
		}
});
socket.on("right", top=> {
	answers.push(top);
	if(answers.length === 4) rooms[Array.from(socket.rooms)[1]].push({answer: answers, room: Array.from(socket.rooms)[1]});
});
		socket.on("top1", top=> {
	guess.push(top);	
			if(guess.length === 4){
				console.log(answers);
				console.log(guess);
		if(guess[0] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[0] && guess[1] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[1] && guess[2] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[2] && guess[3] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[3]) {socket.emit("good"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("correct")}
		else {socket.emit("bad"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("wrong")}
				guess = [];
			if(clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on > 0){
				clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on -= 1;
			}
				else{
					clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on = clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].count - 1;
				}
			}
});
	socket.on("left1", top=> {
	guess.push(top);	
			if(guess.length === 4){
				finals++;
				console.log(answers);
				console.log(guess);
		if(guess[0] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[0] && guess[1] === rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[1] && guess[2] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[2] && guess[3] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[3]) {socket.emit("good"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("correct")}
		else {socket.emit("bad"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("wrong")}
				guess = [];
				if(finals === clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].count - 1){
					finals = 0;
			if(clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on > 0){
				clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on -= 1;
				clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].client[clientrooms[clientrooms.findIndex(r=> r.room === Array.from(socket.rooms)[1])].on].emit("start");
clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].client[clientrooms[clientrooms.findIndex(r=> r.room === Array.from(socket.rooms)[1])].on].broadcast.to(Array.from(socket.rooms)[1]).emit("newstart");
			}
				else{
					clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on = clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].count - 1;
									clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].client[clientrooms[clientrooms.findIndex(r=> r.room === Array.from(socket.rooms)[1])].on].emit("start");
clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].client[clientrooms[clientrooms.findIndex(r=> r.room === Array.from(socket.rooms)[1])].on].broadcast.to(Array.from(socket.rooms)[1]).emit("newstart");
				}
			}
			}
});
	

socket.on("bottom1", top=> {
	guess.push(top);	
			if(guess.length === 4){
				console.log(answers);
				console.log(guess);
		if(guess[0] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[0] && guess[1] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[1] && guess[2] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[2] && guess[3] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[3]) {socket.emit("good"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("correct")}
		else {socket.emit("bad"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("wrong")}
				guess = [];
			if(clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on > 0){
				clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on -= 1;
			}
				else{
					clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on = clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].count - 1;
				}
			}
});
	socket.on("right1", top=> {
	guess.push(top);	
			if(guess.length === 4){
				console.log(answers);
				console.log(guess);
		if(guess[0] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[0] && guess[1] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[1] && guess[2] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[2] && guess[3] ===rooms[clientrooms.findIndex(r => r.room === Array.from(socket.rooms)[1])][0].answer[3]) {socket.emit("good"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("correct")}
		else {socket.emit("bad"); socket.broadcast.to(Array.from(socket.rooms)[1]).emit("wrong")}
				guess = [];
			if(clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on > 0){
				clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on -= 1;
			}
				else{
					clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].on = clientrooms[clientrooms.findIndex(x=> x.room === Array.from(socket.rooms)[1])].count - 1;
				}
			}
});
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
