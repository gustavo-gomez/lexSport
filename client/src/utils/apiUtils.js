import axios from 'axios'
import {AUTH_TOKEN_KEY} from "../slices/authSlice";

const BASE_URL = process.env.REACT_APP_LEX_SPORT_IP_BACKEND || 'http://192.168.18.6:9000'


export const ENDPOINTS = {
	LOGIN: '/login',
	WORKERS: '/workers',
	PRODUCTS: '/products',
}

export const loginAPI = async (user, password) => {
	return await callAPI('post', BASE_URL + ENDPOINTS.LOGIN, {user, password})
}

// Get all costureras
export const getAllCosturerasAPI = async () => {
	return await callAPI('get', BASE_URL + ENDPOINTS.WORKERS)
}

// Get all products
export const getAllProductsAPI = async () => {
	return await callAPI('get', BASE_URL + ENDPOINTS.PRODUCTS)
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
		const {data} = await axios(url, config)
		return data
	} catch (error) {
		console.log('error: ', error?.response);
		return {
			isError: true,
			responseCode: error?.response?.status,
			responseMessage: error?.response?.data?.responseMessage || 'Error'
		}
	}
}
