import { camelize } from '../utils/utils'
import { loadSchedules, newSchedules, updateSchedule } from '../repositories/scheduleRepository'

export const newSchedulesService = async (schedules = [], id) => {
	const usersDB = await newSchedules(schedules, id)
	return camelize(usersDB)
}

export const loadSchedulesService = async (workerId, startDate, endDate, idToFilter) => {
	const activitiesDB = await loadSchedules(workerId, startDate, endDate, idToFilter)
	return camelize(activitiesDB)
}

export const updateSchedulesService = async (schedule, submitterId) => {
	const activitiesDB = await updateSchedule(schedule, submitterId)
	return camelize(activitiesDB)
}
