import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {loadUserAPI, loginAPI, newUserAPI} from "../utils/apiUtils"
import isEmpty from "lodash/isEmpty"
import jwtDecode from 'jwt-decode'

export const AUTH_TOKEN_KEY = 'authTokenLexSport'

const initialState = {
	isLoading: false,
	loggedUser: null,
	error: null,
	successMessage: null
}


export const login = createAsyncThunk(
	'auth/login',
	async ({email, password}, thunkAPI) => {
		const {responseCode, data, responseMessage} = await loginAPI(email, password)
		if (responseCode === 0) {
			return data
		} else {
			return thunkAPI.rejectWithValue({responseMessage})
		}
	},
)

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state, action) => {
			localStorage.removeItem(AUTH_TOKEN_KEY)
			state.loggedUser = null
			state.error = null
		},
		updateUser: (state, action) => {
			state.loggedUser = jwtDecode(localStorage.getItem(AUTH_TOKEN_KEY))
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state, {payload}) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(login.fulfilled, (state, {payload}) => {
				const {worker = {}} = payload
				state.loggedUser = worker
				state.isLoading = false
				localStorage.setItem(AUTH_TOKEN_KEY, worker?.token)
			})
			.addCase(login.rejected, (state, {payload}) => {
				const {responseMessage = ''} = payload
				state.isLoading = false
				state.error = isEmpty(responseMessage) ? null : responseMessage
			})
	}
})


export const {logout, updateUser} = authSlice.actions

export const auth = (state) => state.auth

export default authSlice.reducer

