import { getConnection } from '../database/conectDB.js'
import { uuid } from 'uuidv4'
import { joinQuestionsMark, ROLES } from '../utils/utils'

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


export const loadWorkerById = async id => {
	const connection = await getConnection()
	const sql = `
      SELECT *
      FROM workers
      WHERE id = ?
	`
	const [rows] = await connection.execute(sql, [id])
	await connection.end()
	return rows || []
}

export const loadWorkersByRole = async (roles) => {
	const connection = await getConnection()
	let sqlParams = []
	let sql = `
      SELECT *
      FROM workers
	`
      // WHERE can_login = '0'
	// role = '${ROLES.COSTURERA}' and
	if (roles?.length > 0) {
		sql += ` WHERE role IN (${joinQuestionsMark(roles)})`
		sqlParams.push(...roles)
	}

	const [rows] = await connection.execute(sql, sqlParams)
	await connection.end()
	return rows || []
}

export const newWorker = async ({ firstName, lastName, phone = null, oldWorker = false, role, password = null, permission = null, user = null }) => {
	console.log(firstName, lastName, phone, oldWorker, role, password, permission)
	const connection = await getConnection()
	const sql = `
      INSERT INTO workers (id, first_name, last_name, phone, old_worker, role, password, permission, user)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

	`
	const [rows] = await connection.execute(sql, [uuid(), firstName, lastName, phone, oldWorker, role, password, permission, user])
	await connection.end()
	return rows || []
}

export const updateCosturera = async (id, { firstName, lastName, phone = null, oldWorker, role = null, permission = null, user = null}) => {
	const connection = await getConnection()
	const sql = `
      UPDATE workers
      SET first_name = ?,
          last_name  = ?,
          phone      = ?,
          old_worker = ?,
          role = ?,
          permission = ?,
					user = ?
      WHERE id = ?

	`
	const [rows] = await connection.execute(sql, [firstName, lastName, phone, oldWorker, role, permission, user, id])
	await connection.end()
	return rows || []
}

export const deleteCosturera = async (id) => {
	const connection = await getConnection()
	let sql = `
      UPDATE workers
      SET hidden = '1'
      WHERE id = ?
	`

	const [rows] = await connection.execute(sql, [id])
	await connection.end()
	return rows || []
}
