import startCase from 'lodash/startCase'
import camelCase from 'lodash/camelCase'
import moment from 'moment'

export const PERU_TIME_OFFSET = -5
export const MILLISECONDS_IN_ONE_HOUR = 3600 * 1000
export const MILLISECONDS_IN_ONE_DAY = MILLISECONDS_IN_ONE_HOUR * 24


export const textToCamelCase = (text) => {
	return startCase(camelCase(text))
}

export const getStartDateMillis = (date) => {
	const peruMoment = moment(date).utcOffset(PERU_TIME_OFFSET)
	peruMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	return peruMoment.valueOf()
}

export const getEndDateMillis = (date) => {
	const peruMoment = moment(date).utcOffset(PERU_TIME_OFFSET)
	peruMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	return peruMoment.valueOf() + MILLISECONDS_IN_ONE_DAY
}
