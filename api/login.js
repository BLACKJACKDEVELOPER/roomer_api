const db = require('../db.js')
const JWT = require('jsonwebtoken')

// env
require('dotenv').config()

module.exports = {
	async post(req,res) {
		try {
			const { body:{ email , password , remember } } = req
			const data = await db('SELECT * FROM users WHERE email=? AND password=?;',
				[email,password])
			if (data == false) {
				return res.json({
					pass:false,
					msg:"Not Found Account!!!"
				})
			}
			if (remember == false) {
				// create session token per day
				const token_ses = await JWT.sign(data[0],process.env.JWT,{ expiresIn:'1h' })
				return res.json({
					pass:true,
					data:token_ses
				})
			}
			// create session token
			const token_ses = await JWT.sign(data[0],process.env.JWT)
			return res.json({
				pass:true,
				data:token_ses
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