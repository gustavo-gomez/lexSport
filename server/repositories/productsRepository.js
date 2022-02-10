import {getConnection} from "../database/conectDB.js";

export const loadAllProducts = async user => {
	const connection = await getConnection()
	const sql = `
      select *
      from products
	`
	const [rows] = await connection.execute(sql)
	await connection.end()
	return rows || []
}

