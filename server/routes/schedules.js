import { Router } from 'express'
import {
	calcExtraMinutes,
	getGenericMessage,
	getPeruDay, getPeruDayWithHour,
	getSuccessResponse,
	HTTP_STATUS_CODES, milliSecondsToMinutes, minutesToHoursAndMinutes, SATURDAY, SATURDAY_ENTER_HOUR, SCHEDULE_ACTIONS,
	validationErrorsToArray, WEEKDAY_ENTER_HOUR
} from '../utils/utils.js'
import { verifyAuthJWToken } from '../utils/passUtils.js'
import { loadSchedulesService, newSchedulesService, updateSchedulesService } from '../services/scheduleService'
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
				const enterActivity = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.ENTER)
				const enterMillis = enterActivity?.milliseconds

				const breakActivity = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.BREAK)
				const breakMillis = breakActivity?.milliseconds

				const endBreakActivity = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.END_BREAK)
				const endBreakMillis = endBreakActivity?.milliseconds

				const exitActivity = activitiesPerWorkerOneDay.find(activity => activity.action === SCHEDULE_ACTIONS.EXIT)
				const exitMillis = exitActivity?.milliseconds

				let workedMinutes = 0
				let lateHoursMinutes = 0
				const isSaturday = enterMillis && moment(enterMillis).weekday() === SATURDAY

				if (enterMillis && exitMillis) {
					const firstHoursMillis = moment(breakMillis).diff(enterMillis)
					const secondHoursMillis = moment(exitMillis).diff(endBreakMillis)
					workedMinutes = milliSecondsToMinutes(firstHoursMillis + secondHoursMillis)

					let enterHour = getPeruDayWithHour(enterMillis, WEEKDAY_ENTER_HOUR)
					if (isSaturday) {
						enterHour = getPeruDayWithHour(enterMillis, SATURDAY_ENTER_HOUR)
						workedMinutes = milliSecondsToMinutes(moment(exitMillis).diff(enterMillis))
					}
					const lateHoursMillis = moment(enterMillis).diff(enterHour.getTime())
					lateHoursMinutes = milliSecondsToMinutes(lateHoursMillis)
				}
				schedules.push({
					milliseconds: activitiesInOneDay[0]?.milliseconds,
					worker: activitiesPerWorkerOneDay[0]?.worker,
					enter: enterMillis,
					enterId: enterActivity?.id,
					break: breakMillis,
					breakId: breakActivity?.id,
					endbreak: endBreakMillis,
					endbreakId: endBreakActivity?.id,
					exit: exitMillis,
					exitId: exitActivity?.id,
					extraHours: minutesToHoursAndMinutes(calcExtraMinutes(workedMinutes, isSaturday)),
					workedHours: minutesToHoursAndMinutes(workedMinutes),
					lateHours: minutesToHoursAndMinutes(lateHoursMinutes),
					workerId: enterActivity?.workerId || breakActivity?.workerId || endBreakActivity?.workerId || exitActivity?.workerId
				})
			})
		})


		return res.json(getSuccessResponse({ schedules }))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
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
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

const updateScheduleValidator = [
	check('schedule', 'Actividad es requerida').not().isEmpty(),
]
// insert schedules
router.put('/', [updateScheduleValidator, verifyAuthJWToken], async (req, res) => {
	try {
		const { errors } = validationResult(req)

		if (!isEmpty(errors)) {
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		}
		const { schedule } = req.body
		const { id } = req.tokenDecoded

		await updateSchedulesService(schedule, id)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Horarios actualizados con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})


export default router



