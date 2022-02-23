import { camelize } from '../utils/utils'
import { loadActivities, loadActivitiesQuantities, newActivities } from '../repositories/activityRepository'


export const newActivityService = async (activities, date) => {
	const activitiesDB = await newActivities(activities, date)
	return camelize(activitiesDB)
}

export const getActivitiesService = async (workerId, startDate, endDate) => {
	const activitiesDB = await loadActivities(workerId, startDate, endDate)
	return camelize(activitiesDB)
}

export const loadActivitiesQuantitiesService = async (startDate, endDate, workerId) => {
	const activitiesDB = await loadActivitiesQuantities(startDate, endDate, workerId)
	return camelize(activitiesDB)
}
