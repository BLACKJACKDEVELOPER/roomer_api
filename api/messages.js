const db = require('../db.js')

module.exports = {
	async get(req,res) {
		try {
			const { query:{ roomId }} = req
			const data = await db('SELECT * FROM msg_view WHERE roomId=?;',
				[roomId])
			return res.json(data)

		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:'Something went wrong!!'
			})
		}
	}
}