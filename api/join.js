const db = require('../db.js')

module.exports = {
	async post(req,res) {
		try {
			const { body:{ user_id , roomId } } = req

			const find_user = await db('SELECT user_id,roomId FROM members WHERE user_id=? AND roomId=?;'
				,[user_id,roomId]);
			if (find_user == false) {
				await db('INSERT INTO members(user_id,roomId) VALUES (?,?);',
					[user_id,roomId]);
				return res.json({
					msg:"You Joined this room!",
					pass:true
				})
			}else{
				return res.json({
					msg:"You has been Joined this room!",
					pass:true
				})
			}

		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:"Joining has been failure!?!"
			})
		}
	},
	async get(req,res) {
		try {
			const { query:{ roomId } } = req
			if (roomId) {
				const data = await db('SELECT * FROM members_join WHERE roomId=?;',
					[roomId]);
				return res.json({
					pass:true,
					data:data
				})
			}

		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:"Something went wrong!!!"
			})
		}
	}
}