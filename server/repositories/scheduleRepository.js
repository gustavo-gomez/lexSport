import { getConnection } from '../database/conectDB.js'
import { uuid } from 'uuidv4'
import map from 'lodash/map'

export const newSchedules = async (schedules = [], submitterId) => {

	if (schedules.length === 0) return []
	const connection = await getConnection()

	let sql = `
      INSERT INTO schedules (id, worker_id, action, submitter_id)
      VALUES `

	sql += map(schedules, () => '(?, ?, ?, ?)').join(' ,')

	const values = []
	schedules.some(activity => {
		values.push(uuid())
		values.push(activity.workerId)
		values.push(activity.action)
		values.push(submitterId)
	})

	const [rows] = await connection.execute(sql, values)
	await connection.end()
	return rows || []
}

export const loadSchedules = async (workerId = null, startDate, endDate, idToFilter = null) => {
	const connection = await getConnection()
	let params = [startDate, endDate]
	let sql = `
      SELECT *
      FROM schedules
      WHERE date >= ?
        and date <= ?
	`
	if (workerId) {
		sql += ` and worker_id = ?`
		params.push(workerId)
	}
	if (idToFilter) {
		sql += ` and submitter_id = ?`
		params.push(idToFilter)
	}

	const [rows] = await connection.execute(sql, params)
	await connection.end()
	return rows || []
}
