
const db = require('../db.js')
const fs = require('fs')
const JWT = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
	async get(req,res) {
		try {
			const { query:{ id } } = req
			console.log(req.query)
			const data = await db('SELECT * from users WHERE id=?;',
				[id])
			if (data == false) {
				return res.json({
					pass:false,
					msg:"Not found Account!"
				})
			}
			// response data
			return res.json({
				pass:true,
				data:data[0]
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
			const { body:{ file , firstname , lastname , email , password , id } } = req
			let newData;
			await db('UPDATE users SET firstname=?,lastname=?,email=?,password=? WHERE id=?;',
				[firstname,lastname,email,password,id])
			newData = await db('SELECT * FROM users WHERE id=?;',
				[id])
			if (file) {
				fs.writeFileSync(`${__dirname}/../public/profile/${id}.png`,file,{ encoding:"base64" })
				await db('UPDATE users SET profile=? WHERE id=?;',
					[`${id}.png`,id])
				newData = await db('SELECT * FROM users WHERE id=?;',
				[id])
			}
			const new_token = await JWT.sign(newData[0],process.env.JWT)
			return res.json({
				pass:true,
				data:new_token
			})
		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:"Something went wrong!!!"
			})
		}
	}
}