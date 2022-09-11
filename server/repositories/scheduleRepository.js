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

export const updateSchedule = async (schedule, submitterId) => {
	const connection = await getConnection()

	validateDate(schedule)
	console.log('schedule: ', schedule)

	/* enter */
	let sqlEnter
	let paramsEnter = []
	if (schedule?.enterId) {
		sqlEnter = `
        UPDATE schedules
        SET date = ?
        WHERE id = ?
		`
		paramsEnter.push(new Date(schedule?.enter))
		paramsEnter.push(schedule.enterId)
	} else if (schedule?.enter) {
		sqlEnter = `
        INSERT INTO schedules (id, worker_id, action, date, submitter_id)
        VALUES (?, ?, ?, ?, ?)
		`
		paramsEnter.push(uuid())
		paramsEnter.push(schedule.workerId)
		paramsEnter.push('enter')
		paramsEnter.push(new Date(schedule?.enter))
		paramsEnter.push(submitterId)
	}
	if (paramsEnter.length > 0)
		await connection.execute(sqlEnter, paramsEnter)

	console.log('enter ok')
	/* break */
	let sqlBreak
	let paramsBreak = []
	if (schedule?.breakId) {
		sqlBreak = `
        UPDATE schedules
        SET date = ?
        WHERE id = ?
		`
		paramsBreak.push(new Date(schedule?.break))
		paramsBreak.push(schedule.breakId)
	} else if (schedule?.break) {
		sqlBreak = `
        INSERT INTO schedules (id, worker_id, action, date, submitter_id)
        VALUES (?, ?, ?, ?, ?)
		`
		paramsBreak.push(uuid())
		paramsBreak.push(schedule.workerId)
		paramsBreak.push('break')
		paramsBreak.push(new Date(schedule?.break))
		paramsBreak.push(submitterId)
	}
	if (paramsBreak.length > 0)
		await connection.execute(sqlBreak, paramsBreak)
	console.log('break ok')

	/* endBreak */
	let sqlEndBreak
	let paramsEndBreak = []
	if (schedule?.endbreakId) {
		sqlEndBreak = `
        UPDATE schedules
        SET date = ?
        WHERE id = ?
		`
		paramsEndBreak.push(new Date(schedule?.endbreak))
		paramsEndBreak.push(schedule.endbreakId)
	} else if (schedule?.endbreak) {
		sqlEndBreak = `
        INSERT INTO schedules (id, worker_id, action, date, submitter_id)
        VALUES (?, ?, ?, ?, ?)
		`
		paramsEndBreak.push(uuid())
		paramsEndBreak.push(schedule.workerId)
		paramsEndBreak.push('endbreak')
		paramsEndBreak.push(new Date(schedule?.endbreak))
		paramsEndBreak.push(submitterId)
	}
	if (paramsEndBreak.length > 0)
		await connection.execute(sqlEndBreak, paramsEndBreak)
	console.log('endbreak ok')

	/* exit */
	let sqlExit
	let paramsExit = []
	if (schedule?.exitId) {
		sqlExit = `
        UPDATE schedules
        SET date = ?
        WHERE id = ?
		`
		paramsExit.push(new Date(schedule?.exit))
		paramsExit.push(schedule.exitId)
	} else if (schedule?.exit) {
		sqlExit = `
        INSERT INTO schedules (id, worker_id, action, date, submitter_id)
        VALUES (?, ?, ?, ?, ?)
		`
		paramsExit.push(uuid())
		paramsExit.push(schedule.workerId)
		paramsExit.push('exit')
		paramsExit.push(new Date(schedule?.exit))
		paramsExit.push(submitterId)
	}
	if (paramsExit.length > 0)
		await connection.execute(sqlExit, paramsExit)
	console.log('exit ok')

	await connection.end()

}

const validateDate = (schedule) => {
	let guide
	if (schedule?.enterId) guide = schedule?.enter
	if (schedule?.breakId) guide = schedule?.break
	if (schedule?.endbreakId) guide = schedule?.endbreak
	if (schedule?.exitId) guide = schedule?.exit

	const guidDate = new Date(guide)

	if (schedule?.enter) {
		const enterDate = new Date(schedule?.enter)
		enterDate.setFullYear(guidDate.getFullYear())
		enterDate.setMonth(guidDate.getMonth())
		enterDate.setDate(guidDate.getDate())
		schedule.enter = enterDate.getTime()
	}
	if (schedule?.break) {
		const breakDate = new Date(schedule?.break)
		breakDate.setFullYear(guidDate.getFullYear())
		breakDate.setMonth(guidDate.getMonth())
		breakDate.setDate(guidDate.getDate())
		schedule.break = breakDate.getTime()
	}
	if (schedule?.endbreak) {
		const endbreakDate = new Date(schedule?.endbreak)
		endbreakDate.setFullYear(guidDate.getFullYear())
		endbreakDate.setMonth(guidDate.getMonth())
		endbreakDate.setDate(guidDate.getDate())
		schedule.endbreak = endbreakDate.getTime()
	}
	if (schedule?.exit) {
		const exitDate = new Date(schedule?.exit)
		exitDate.setFullYear(guidDate.getFullYear())
		exitDate.setMonth(guidDate.getMonth())
		exitDate.setDate(guidDate.getDate())
		schedule.exit = exitDate.getTime()
	}
}
