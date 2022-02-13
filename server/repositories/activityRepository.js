import { getConnection } from '../database/conectDB.js'
import { uuid } from 'uuidv4'
import map from 'lodash/map'

export const newActivity = async (activities = [], dateMillis = new Date().getTime()) => {
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
		values.push(dateMillis)
	})

	const [rows] = await connection.execute(sql, values)
	await connection.end()
	return rows || []
}
