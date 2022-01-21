import axios from 'axios'
import {AUTH_TOKEN_KEY} from "../slices/authSlice";

const BASE_URL = process.env.REACT_APP_LEX_SPORT_IP_BACKEND || 'http://192.168.18.6:9000'


export const ENDPOINTS = {
	LOGIN: '/login',
}

export const loginAPI = async (email, password) => {
	return await callAPI('post', BASE_URL + ENDPOINTS.LOGIN, {email, password})
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
		console.error(`Error on request: ${error}`)
	}
}
