import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../slices/authSlice'
import isEmpty from 'lodash/isEmpty'

// const BASE_URL = process.env.REACT_APP_LEX_SPORT_IP_BACKEND || 'http://192.168.18.6:9000'
const BASE_URL = 'http://164.92.64.212:9000'


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
