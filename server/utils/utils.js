import map from 'lodash/map.js'
import transform from 'lodash/transform'
import isArray from 'lodash/isArray'
import camelCase from 'lodash/camelCase'
import isObject from 'lodash/isObject'
import moment from 'moment'

export const PERU_TIME_OFFSET = -5

export const getGenericMessage = (message = 'Ocurrió un error') => ({
	responseMessage: message
})


export const getSuccessResponse = data => ({
	// responseCode: 0,
	data: {
		...data
	}
})

export const joinQuestionsMark = array => map(array, () => '?').join(' ,')

export const validationErrorsToArray = errors => map(errors, e => e.msg)

export const HTTP_STATUS_CODES = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,

}

export const camelize = obj => obj === null ? null : transform(obj, (acc, value, key, target) => {
	const camelKey = isArray(target) ? key : camelCase(key)
	acc[camelKey] = (isObject(value) && !(value instanceof Date)) ? camelize(value) : value
})

export const ROLES = {
	ADMIN: 'admin',
	COSTURERA: 'costurera',
	OPERATOR: 'operator',
	JORNAL: 'jornalero',
}

export const OPERATOR_ROLES = {
	MAKES: 'makes',
	FILL: 'fill',
	SCHEDULE: 'schedule'
}

export const SCHEDULE_ACTIONS = {
	ENTER: 'enter',
	BREAK: 'break',
	END_BREAK: 'endbreak',
	EXIT: 'exit'
}


export const getPeruDay = milliseconds => {
	const peruMoment = moment(milliseconds).utcOffset(PERU_TIME_OFFSET)
	peruMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	return new Date(peruMoment.valueOf())
}

export const getPeruDayWithHour = (milliseconds, hour) => {
	const peruMoment = moment(milliseconds).utcOffset(PERU_TIME_OFFSET)
	peruMoment.set({ hour: hour, minute: 0, second: 0, millisecond: 0 })
	return new Date(peruMoment.valueOf())
}

export const milliSecondsToMinutes = (millis) => {
	const minutes = moment.duration(millis).minutes()
	const hours = Math.trunc(moment.duration(millis).asHours())
	return hours * 60 + minutes
}

export const minutesToHoursAndMinutes = (min) => {
	const hours = (min / 60)
	const rHours = Math.floor(hours)
	const minutes = (hours - rHours) * 60
	const rMinutes = Math.round(minutes)
	return `${rHours.toString().padStart(2, '0')}:${rMinutes.toString().padStart(2, '0')}`
}

export const WEEKDAY_ENTER_HOUR = 7
export const SATURDAY_ENTER_HOUR = 8
export const SATURDAY = 6
export const WEEKDAY_WORKING_MINUTES = 600 // 10 hours - 7am to 6pm - 1 hour break
export const SATURDAY_WORKING_MINUTES = 300 // 5 hours - 8am to 1pm - no break

export const calcExtraMinutes = (minutes, isSaturday) => {
	const totalMinutes = isSaturday ? SATURDAY_WORKING_MINUTES : WEEKDAY_WORKING_MINUTES
	const extra = minutes - totalMinutes
	return extra > 0 ? extra : 0
}
