const app = require('./middlewarer')
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
	cors:{
		origins:['https://roomer-delta.vercel.app']
	},
	maxHttpBufferSize: 1e8
})


const register = require('./api/register.js')
const login = require('./api/login.js')
const auth = require('./api/auth.js')
const profile = require('./api/profile.js')
const room = require('./api/room.js')
const messages = require('./api/messages.js')
const join = require('./api/join.js')

app.post('/api/register',register.post)
app.post('/api/login',login.post)
app.post('/api/auth',auth.post)
app.post('/api/profile',profile.post)
app.post('/api/room',room.post)
app.post('/api/join',join.post)

app.get('/api/profile',profile.get)
app.get('/api/room',room.get)
app.get('/api/messages',messages.get)
app.get('/api/join',join.get)



const db = require('./db.js')
const fs = require('fs')
const JWT = require('jsonwebtoken')
require('dotenv').config()

io.on('connection', (socket) => {
  console.log('a user connected');

  // notify members in room
  socket.on('notifyRoom',async (roomId)=> {
  	const members = await db('SELECT user_id FROM members WHERE roomId=?;',[roomId]);
 	members.map(async (perId)=> io.emit(`notify/${perId.user_id}`,{roomId,notify:1}))
  })

  // event listener
  socket.on('join',async (data)=> {
  	socket.join('room/'+data.roomId)
  })

  // leaving current room
  socket.on('leave',async (data)=> {
  	console.log(data)
  	let roomId = data.roomId
  	data = await new JWT.verify(data.token,process.env.JWT);
  	await db('UPDATE members SET status="OFFLINE" WHERE user_id=?;',[data.id]);
  	io.to('room/'+roomId).emit('leaved',data.id)
  })

  // change status who that join and send status to everyone
  socket.on('change_status',async (data)=> {
  	await db('UPDATE members SET status="ONLINE" WHERE user_id=?;',[data.user_id]);
  	io.to('room/'+data.roomId).emit('status',data.user_id)
  })

  // revice message and send back to everyone
  socket.on('send',async (data)=> {
  	console.log(data)
  	const name = Math.floor(Math.random() * 100000)
  	switch (data.info.type) {
  		case 'text':
  		await db('INSERT INTO messages(roomId,type,msg,date,perId) VALUES (?,?,?,?,?);',
  			[data.roomId,data.info.type,data.info.msg,data.info.date,data.info.perId])
  		break
  		case 'image':
  		// getfile and save
  		const pureBase64_image = data.info.msg.split(';base64,').pop()
  		fs.writeFileSync(`${__dirname}/public/stores/${name}.png`,pureBase64_image,{ encoding:'base64' })
  		await db('INSERT INTO messages(roomId,type,msg,date,perId) VALUES (?,?,?,?,?);',
  			[data.roomId,data.info.type,`${name}.png`,data.info.date,data.info.perId])
  			data.info.msg = `${name}.png`
  		break
  		case 'video':
  		const pureBase64_video = data.info.msg.split(';base64,').pop()
  		fs.writeFileSync(`${__dirname}/public/stores/${name}.mp4`,pureBase64_video,{ encoding:'base64' })
  		await db('INSERT INTO messages(roomId,type,msg,date,perId) VALUES (?,?,?,?,?);',
  			[data.roomId,data.info.type,`${name}.mp4`,data.info.date,data.info.perId])
  			data.info.msg = `${name}.mp4`
  		break
  	}
  	io.to('room/'+data.roomId).emit('reply',data.info)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// start server
http.listen(3030,()=> {
	console.log('SERVER START ON PORT 3030')
})
