import { camelize } from '../utils/utils'
import { loadActivities, newActivities } from '../repositories/activityRepository'


export const newActivityService = async (activities, dateMillis) => {
	const activitiesDB = await newActivities(activities, dateMillis)
	return camelize(activitiesDB)
}

export const getActivitiesService = async (startDate, endDate) => {
	const activitiesDB = await loadActivities(startDate, endDate)
	return camelize(activitiesDB)
}
