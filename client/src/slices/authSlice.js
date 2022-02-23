import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {loginAPI} from "../utils/apiUtils"
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
		const {data, responseMessage, isError} = await loginAPI(email, password)
		if (!isError) {
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
		updateLoggedUser: (state, {payload}) => {
			state.loggedUser = payload
		},
		logout: (state, action) => {
			localStorage.removeItem(AUTH_TOKEN_KEY)
			window.location.reload()
			state.loggedUser = null
			state.error = null
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


export const {logout, updateLoggedUser} = authSlice.actions

export const auth = (state) => state.auth

export default authSlice.reducer

