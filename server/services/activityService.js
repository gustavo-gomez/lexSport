import { camelize } from '../utils/utils'
import { newActivity } from '../repositories/activityRepository'


export const newActivityService = async (activities, dateMillis) => {
	const usersDB = await newActivity(activities, dateMillis)
	return camelize(usersDB)
}
