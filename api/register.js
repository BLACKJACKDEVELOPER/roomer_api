const db = require('../db.js')


module.exports = {
	async post(req,res) {
		try {
			const { body:{ firstname , lastname , birth , email , password } } = req
			await db('INSERT INTO users(firstname,lastname,birth,email,password) VALUES (?,?,?,?,?);',
				[firstname,lastname,birth,email,password]);
			res.json({
				pass:true,
				msg:"Register successfully"
			})
		}catch(e) {
			console.log(e)
			res.json({
				pass:false,
				msg:"Something went wrong!!!"
			})
		}
	}
}