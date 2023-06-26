const db = require('../db.js')
const fs = require('fs')

module.exports = {
	
	async get(req,res) {
		try {
			const { query:{ owner , roomId , offset , search } } = req
			let data
			if (owner) {
				data = await db('SELECT * FROM list_rooms WHERE u_id=? LIMIT 10 OFFSET ?;',
					[owner,((offset ? offset : 1) - 1) * 10])
				return res.json({
					pass:true,
					data:data
				})
			}
			if (roomId) {
				data = await db('SELECT * FROM list_rooms WHERE r_id=?;',[roomId])
				return res.json({
					pass:true,
					data:data
				})
			}
			if (search) {
				data = await db('SELECT * FROM list_rooms WHERE r_name LIKE ?;',
					[`${search}%`])
				return res.json({
					pass:true,
					data:data
				})
			}

			data = await db('SELECT * FROM list_rooms LIMIT 10 OFFSET ?;',
				[((offset ? offset : 1) - 1) * 10]);
			return res.json({
				pass:true,
				data:data
			})

		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:"Something went wrong!!!"
			})
		}
	},
	async post(req,res) {
		try {
			const { body:{ date_create , owner , room_name , room_amount , type_room , password , file } } = req
			const name = Math.floor(Math.random() * 10000);
			if (file) {
				fs.writeFileSync(`${__dirname}/../public/profile/${name}.jpg`,file,{ encoding:'base64' })
			}
			file ? await db('INSERT INTO rooms(profile,name,members,type,password,owner,date_create) VALUES (?,?,?,?,?,?,?);',[`${name}.jpg`,room_name,room_amount,type_room,password,owner,date_create]) : await db('INSERT INTO rooms(profile,name,members,type,password,owner,date_create) VALUES (?,?,?,?,?,?,?);',[file,room_name,room_amount,type_room,password,owner,date_create])
			return res.json({
				pass:true,
				msg:"Created Room!!"
			})
		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:"Something went wrong!!"
			})
		}
	}
}