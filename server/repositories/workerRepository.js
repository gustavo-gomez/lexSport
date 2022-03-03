import {getConnection} from "../database/conectDB.js";
import {uuid} from "uuidv4";
import { ROLES } from '../utils/utils'

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

export const loadAllCostureras = async () => {
	const connection = await getConnection()
	const sql = `
      SELECT *
      FROM workers
      WHERE role = '${ROLES.COSTURERA}' and can_login = '0'
	`
	const [rows] = await connection.execute(sql)
	await connection.end()
	return rows || []
}

export const newCosturera = async ({firstName, lastName, phone, oldWorker = false, role}) => {
	const connection = await getConnection()
	const sql = `
      INSERT INTO workers (id, first_name, last_name, phone, old_worker, role)
      VALUES (?, ?, ?, ?, ?, ?)

	`
	const [rows] = await connection.execute(sql, [uuid(), firstName, lastName, phone, oldWorker, role])
	await connection.end()
	return rows || []
}

export const updateCosturera = async (id, {firstName, lastName, phone, oldWorker}) => {
	const connection = await getConnection()
	const sql = `
      UPDATE workers
      SET first_name = ?,
          last_name  = ?,
          phone      = ?,
          old_worker = ?
      WHERE id = ?

	`
	const [rows] = await connection.execute(sql, [firstName, lastName, phone, oldWorker, id])
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
