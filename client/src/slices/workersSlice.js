import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getAllCosturerasAPI} from "../utils/apiUtils"

export const AUTH_TOKEN_KEY = 'authTokenLexSport'

const initialState = {
	workerList: [],
	isLoading: false,
}

export const getAllCostureras = createAsyncThunk(
	'workers/getCostureras',
	async (params, thunkAPI) => {
		const {data, responseMessage, isError} = await getAllCosturerasAPI()
		if (!isError) {
			return data
		} else {
			return thunkAPI.rejectWithValue({responseMessage})
		}
	},
)

export const workersSlice = createSlice({
	name: 'workers',
	initialState,
	reducers: {
		logout: (state, action) => {
			localStorage.removeItem(AUTH_TOKEN_KEY)
			state.loggedUser = null
			state.error = null
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(getAllCostureras.pending, (state, {payload}) => {
			state.isLoading = true
		})
		.addCase(getAllCostureras.fulfilled, (state, {payload}) => {
			const {costureras} = payload
			state.workerList = costureras
			state.isLoading = false
		})
		.addCase(getAllCostureras.rejected, (state, {payload}) => {
			const {responseMessage = ''} = payload
			state.isLoading = false
			// state.error = isEmpty(responseMessage) ? null : responseMessage
		})
	}
})


// export const {logout, updateUser} = workersSlice.actions

export const workers = (state) => state.workers

export default workersSlice.reducer

