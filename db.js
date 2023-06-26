const mdb = require('mariadb')
const server = "https://d8e0-110-164-64-243.ngrok-free.app/adminer/"
const username = "root"
const password = "lion4333"
const database = "roomer"

let pool = mdb.createPool({
	host:server,
	user:username,
	password:password,
	database:database,
	port:4444
})

const db = async (query,data)=> {

	let conn;
  	try {
		conn = await pool.getConnection();
		const res = await conn.query(query,data);
		conn.end()
		return res

  	} catch (err) {
		throw err;
  	}
}

module.exports = db
