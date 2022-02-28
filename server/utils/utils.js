import map from "lodash/map.js";
import transform from "lodash/transform";
import isArray from "lodash/isArray";
import camelCase from "lodash/camelCase";
import isObject from "lodash/isObject";


export const getGenericMessage = (message = 'Contacte al administrador') => ({
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
	const camelKey = isArray(target) ? key : camelCase(key);
	acc[camelKey] = (isObject(value) && !(value instanceof Date)) ? camelize(value) : value;
});

export const ROLES = {
	ADMIN: 'admin',
	COSTURERA: 'costurera',
	OPERATOR: 'operator'
}
