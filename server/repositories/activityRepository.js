import { getConnection } from '../database/conectDB.js'
import { uuid } from 'uuidv4'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

export const newActivities = async (activities = [], date = new Date()) => {
	const connection = await getConnection()
	let sql = `
      INSERT INTO activities (id, worker_id, product_id, quantity, action, price, date)
      VALUES `

	const questionMarks = map(activities, () => '(?, ?, ?, ?, ?, ?, ?)').join(' ,')
	sql += questionMarks
	const values = []
	activities.some(activity => {
		values.push(uuid())
		values.push(activity.workerId)
		values.push(activity.productId)
		values.push(activity.quantity)
		values.push(activity.action)
		values.push(activity.price)
		values.push(date)
	})

	const [rows] = await connection.execute(sql, values)
	await connection.end()
	return rows || []
}

export const loadActivities = async (workerId, startDate, endDate, idToFilter) => {
	const connection = await getConnection()
	let params = [startDate, endDate]
	let sql = `
      SELECT *
      FROM activities
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

export const loadActivitiesQuantities = async (startDate, endDate, workerId) => {
	const connection = await getConnection()
	let params = [startDate, endDate]
	let sql = `
      SELECT product_id, SUM(quantity) as quantity
      FROM activities
      WHERE date >= ?
        and date <= ?
	`
	if (!isEmpty(workerId)) {
		sql += ` and worker_id = ? `
		params.push(workerId)
	}
	sql += ' GROUP BY product_id'

	const [rows] = await connection.execute(sql, params)
	await connection.end()
	return rows || []
}

export const deleteActivity = async (id) => {
	const connection = await getConnection()
	let sql = `
      DELETE
      FROM activities
      WHERE id = ?
	`

	const [rows] = await connection.execute(sql, [id])
	await connection.end()
	return rows || []
}

export const editActivity = async ({ id, workerId, productId, quantity, action, price }) => {
	const connection = await getConnection()
	let sql = `
			UPDATE activities
      SET worker_id  = ?,
          product_id = ?,
          quantity   = ?,
          action     = ?,
          price      = ?
      WHERE id = ?
	`

	const [rows] = await connection.execute(sql, [workerId, productId, quantity, action, price, id])
	await connection.end()
	return rows || []
}
