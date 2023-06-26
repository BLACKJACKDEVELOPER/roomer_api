const JWT = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
	async post(req,res) {
		try {
			const { body:{ token } } = req
			// verify token
			const data = await JWT.verify(token,process.env.JWT);
			return res.json({
				pass:true,
				data:data
			})
		}catch(e) {
			console.log(e)
			return res.json({
				pass:false,
				msg:"Session has been expires !?!"
			})
		}
	}
}