import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../slices/authSlice'
import isEmpty from 'lodash/isEmpty'

// const BASE_URL = process.env.REACT_APP_LEX_SPORT_IP_BACKEND || 'http://192.168.18.6:9000'
const BASE_URL = 'https://ilterflores.com'


export const ENDPOINTS = {
	LOGIN: '/login',
	WORKERS: '/workers',
	PRODUCTS: '/products',
	ACTIVITY: '/activity',
	PRODUCTS_DASHBOARD: '/dashboard/products',
	PRODUCTS_WORKERS: '/dashboard/workers',
	SCHEDULES: '/schedules',
}

export const loginAPI = async (user, password) => {
	return await callAPI('post', BASE_URL + ENDPOINTS.LOGIN, { user, password })
}

// Get all workers
export const getAllWorkersAPI = async (roles) => {
	return await callAPI('GET', `${BASE_URL}${ENDPOINTS.WORKERS}${roles?.length > 0 ? `?roles=${roles?.join(',')}` : ''}`)
}

// create costurera
export const createCostureraAPI = async (worker) => {
	return await callAPI('POST', BASE_URL + ENDPOINTS.WORKERS, { worker })
}

// update costurera
export const updateCostureraAPI = async (id, worker) => {
	return await callAPI('PUT', `${BASE_URL}${ENDPOINTS.WORKERS}/${id}`, { worker })
}


// Get all products
export const getAllProductsAPI = async () => {
	return await callAPI('GET', BASE_URL + ENDPOINTS.PRODUCTS)
}

// create costurera
export const createProductAPI = async (product) => {
	return await callAPI('POST', BASE_URL + ENDPOINTS.PRODUCTS, { product })
}

// update costurera
export const updateProductAPI = async (id, product) => {
	return await callAPI('PUT', `${BASE_URL}${ENDPOINTS.PRODUCTS}/${id}`, { product })
}

// new activities
export const newActivitiesAPI = async (dateMillis, activities) => {
	return await callAPI('POST', `${BASE_URL}${ENDPOINTS.ACTIVITY}`, { dateMillis, activities })
}

// get activities
export const loadActivitiesAPI = async (starDate, endDate, workerId) => {
	return await callAPI('GET', `${BASE_URL}${ENDPOINTS.ACTIVITY}?startDate=${starDate}&endDate=${endDate}${!isEmpty(workerId) ? `&workerId=${workerId}` : ''}`)
}

// delete activities
export const deleteActivityAPI = async (id) => {
	return await callAPI('DELETE', `${BASE_URL}${ENDPOINTS.ACTIVITY}/${id}`)
}

// delete activities
export const editActivityAPI = async (activity) => {
	return await callAPI('PUT', `${BASE_URL}${ENDPOINTS.ACTIVITY}`, { activity })
}

// get products dashboard
export const loadProductsDashboardAPI = async (starDate, endDate) => {
	return await callAPI('GET', `${BASE_URL}${ENDPOINTS.PRODUCTS_DASHBOARD}?startDate=${starDate}&endDate=${endDate}`)
}
// get workers dashboard
export const loadWorkersDashboardAPI = async (starDate, endDate, workerId) => {
	return await callAPI('GET', `${BASE_URL}${ENDPOINTS.PRODUCTS_WORKERS}/${workerId}?startDate=${starDate}&endDate=${endDate}`)
}

// delete product
export const deleteProductAPI = async (id) => {
	return await callAPI('DELETE', `${BASE_URL}${ENDPOINTS.PRODUCTS}/${id}`)
}

// delete costurera
export const deleteCostureraAPI = async (id) => {
	return await callAPI('DELETE', `${BASE_URL}${ENDPOINTS.WORKERS}/${id}`)
}


//new schedules
export const newSchedulesAPI = async (schedules) => {
	return await callAPI('POST', `${BASE_URL}${ENDPOINTS.SCHEDULES}`, { schedules })
}

// get schedules
export const loadSchedulesAPI = async (starDate, endDate, workerId) => {
	return await callAPI('GET', `${BASE_URL}${ENDPOINTS.SCHEDULES}?startDate=${starDate}&endDate=${endDate}${!isEmpty(workerId) ? `&workerId=${workerId}` : ''}`)
}

const callAPI = async (method, url, body) => {
	const authToken = localStorage.getItem(AUTH_TOKEN_KEY)
	const config = {
		method,
		headers: {
			'authorization': authToken ? 'Bearer ' + authToken : '',
			'Access-Control-Allow-Origin': '*'
		},
		data: body || null
	}

	try {
		const { data } = await axios(url, config)
		return data
	} catch ( error ) {
		return {
			isError: true,
			responseCode: error?.response?.status,
			responseMessage: error?.response?.data?.responseMessage || 'Ocurrió un error'
		}
	}
}
