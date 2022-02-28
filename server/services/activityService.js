import { camelize } from '../utils/utils'
import {
	deleteActivity, editActivity,
	loadActivities,
	loadActivitiesQuantities,
	newActivities
} from '../repositories/activityRepository'


export const newActivityService = async (activities, date) => {
	const activitiesDB = await newActivities(activities, date)
	return camelize(activitiesDB)
}

export const getActivitiesService = async (workerId, startDate, endDate, idToFilter = null) => {
	const activitiesDB = await loadActivities(workerId, startDate, endDate, idToFilter)
	return camelize(activitiesDB)
}

export const loadActivitiesQuantitiesService = async (startDate, endDate, workerId) => {
	const activitiesDB = await loadActivitiesQuantities(startDate, endDate, workerId)
	return camelize(activitiesDB)
}

export const deleteActivityService = async (id) => {
	const activitiesDB = await deleteActivity(id)
	return camelize(activitiesDB)
}

export const editActivityService = async (activity) => {
	const activitiesDB = await editActivity(activity)
	return camelize(activitiesDB)
}
