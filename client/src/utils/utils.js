import startCase from 'lodash/startCase'
import camelCase from 'lodash/camelCase'
import moment from 'moment'
import { utils, writeFile } from 'xlsx'

export const MOBILE_WIDTH = 900
export const PERU_TIME_OFFSET = -5
export const MILLISECONDS_IN_ONE_HOUR = 3600 * 1000
export const MILLISECONDS_IN_ONE_DAY = MILLISECONDS_IN_ONE_HOUR * 24
export const DATE_FORMAT = {
	DATE_HYPHEN_PERU: 'DD-MM-YYYY',
}

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

export const generateXlsAndDownload = async (object = [], xlsSheetName, xlsName) => {
	const workBook = utils.book_new()
	let workSheet = utils.json_to_sheet(object)
	utils.book_append_sheet(workBook, workSheet, xlsSheetName)
	await writeFile(workBook, `${xlsName}.xlsx`)
}

export const ROLES = {
	ADMIN: 'admin',
	COSTURERA: 'costurera',
	OPERATOR: 'operator'
}

export const scrollToTop = () => {
	window.scrollTo(0, 0)
	document.body.scrollTop = 0
}
