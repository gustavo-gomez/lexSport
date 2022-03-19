import { Router } from 'express'
import {
	calcExtraMinutes,
	getGenericMessage,
	getPeruDay,
	getSuccessResponse,
	HTTP_STATUS_CODES, milliSecondsToMinutes, minutesToHoursAndMinutes, SATURDAY, SCHEDULE_ACTIONS,
	validationErrorsToArray
} from '../utils/utils.js'
import { verifyAuthJWToken } from '../utils/passUtils.js'
import { loadSchedulesService, newSchedulesService } from '../services/scheduleService'
import { check, validationResult } from 'express-validator'
import isEmpty from 'lodash/isEmpty'
import { loadWorkersByRoleService } from '../services/workerService'
import { groupBy, orderBy, forEach } from 'lodash'
import moment from 'moment'

const router = Router()

//load schedules
router.get('/', [verifyAuthJWToken], async (req, res) => {
	try {
		const { startDate, endDate, workerId } = req.query
		const activitiesDB = await loadSchedulesService(workerId, new Date(+startDate), new Date(+endDate))
		const workers = await loadWorkersByRoleService()

		const allActivities = orderBy(activitiesDB, 'date', 'desc').map(activity => {
			const worker = workers.find(worker => worker.id === activity.workerId)
			return {
				id: activity?.id,
				action: activity?.action,
				milliseconds: new Date(activity?.date).getTime(),
				peruDay: moment(getPeruDay(activity?.date)).format('dd-MM-YYYY'),
				workerId: activity.workerId,
				worker: `${worker?.lastName}, ${worker?.firstName}`,
			}
		})
		let schedules = []
		forEach(groupBy(allActivities, 'peruDay'), activitiesInOneDay => {
			forEach(groupBy(activitiesInOneDay, 'workerId'), activitiesPerWorkerOneDay => {
				const enterMillis = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.ENTER)?.milliseconds
				const breakMillis = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.BREAK)?.milliseconds
				const endBreakMillis = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.END_BREAK)?.milliseconds
				const exitMillis = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.EXIT)?.milliseconds

				let workedMinutes = 0
				console.log(moment(enterMillis).weekday())
				const isSaturday = enterMillis && moment(enterMillis).weekday() === SATURDAY
				if (enterMillis && breakMillis && endBreakMillis && exitMillis) {
					const firstHoursMillis = moment(breakMillis).diff(enterMillis)
					const secondHoursMillis = moment(exitMillis).diff(endBreakMillis)
					workedMinutes = milliSecondsToMinutes(firstHoursMillis + secondHoursMillis)

					if (isSaturday) {
						workedMinutes = milliSecondsToMinutes(moment(exitMillis).diff(enterMillis))
					}

				}
				schedules.push({
					milliseconds: activitiesInOneDay[0]?.milliseconds,
					worker: activitiesPerWorkerOneDay[0]?.worker,
					enter: enterMillis,
					break: breakMillis,
					endbreak: endBreakMillis,
					exit: exitMillis,
					extraHours: minutesToHoursAndMinutes(calcExtraMinutes(workedMinutes, isSaturday)),
					workedHours: minutesToHoursAndMinutes(workedMinutes),

				})
			})
		})


		return res.json(getSuccessResponse({ schedules }))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})


const newScheduleValidator = [
	check('schedules', 'Actividad es requerida').not().isEmpty(),
]
// insert schedules
router.post('/', [newScheduleValidator, verifyAuthJWToken], async (req, res) => {
	try {
		const { errors } = validationResult(req)

		if (!isEmpty(errors)) {
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		}
		const { schedules } = req.body
		const { id } = req.tokenDecoded

		await newSchedulesService(schedules, id)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Horarios creados con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})


export default router



