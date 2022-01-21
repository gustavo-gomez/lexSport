import map from "lodash/map.js";


export const getGenericErrorResponse = (message = 'Contact your administrator') => ({
	responseCode: 100,
	responseMessage: message
})

export const getValidationErrorResponse = ({message = 'Error en campos', errors = []}) => ({
	responseCode: 102,
	responseMessage: message,
	errors
})

export const getForbiddenErrorResponse = () => ({
	responseCode: 101,
	responseMessage: 'Not authorized'
})

export const getSuccessResponse = data => ({
	responseCode: 0,
	data: {
		...data
	}
})

export const joinQuestionsMark = array => map(array, () => '?').join(' ,')

