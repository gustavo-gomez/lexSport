import map from "lodash/map.js";


export const getGenericErrorResponse = (message = 'Contacte al administrador') => ({
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
	INTERNAL_SERVER_ERROR: 500
}
