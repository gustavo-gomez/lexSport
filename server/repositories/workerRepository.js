import {getConnection} from "../database/conectDB.js";

export const loadWorkerByUser = async user => {
	const connection = await getConnection()
	const sql = `
      select *
      from workers
       where user = ?
	`
	const [rows] = await connection.execute(sql, [user])
	await connection.end()
	return rows || []
}

