import { camelize } from '../utils/utils'
import { loadSchedules, newSchedules } from '../repositories/scheduleRepository'
import { loadActivities } from '../repositories/activityRepository'

export const newSchedulesService = async (schedules = [], id) => {
	const usersDB = await newSchedules(schedules, id)
	return camelize(usersDB)
}

export const loadSchedulesService = async (workerId, startDate, endDate, idToFilter) => {
	const activitiesDB = await loadSchedules(workerId, startDate, endDate, idToFilter)
	return camelize(activitiesDB)
}
