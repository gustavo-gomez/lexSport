import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getAllWorkersAPI} from "../utils/apiUtils"

export const AUTH_TOKEN_KEY = 'authTokenLexSport'

const initialState = {
	workerList: [],
	activeWorkerList: [],
	isLoading: false,
}

export const getWorkers = createAsyncThunk(
	'workers/getCostureras',
	async ({ roles }, thunkAPI) => {
		const {data, responseMessage, isError} = await getAllWorkersAPI(roles)
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
		.addCase(getWorkers.pending, (state, {payload}) => {
			state.isLoading = true
		})
		.addCase(getWorkers.fulfilled, (state, {payload}) => {
			const {workers} = payload
			state.workerList = workers
			state.activeWorkerList = workers.filter(worker => worker.hidden === 0)
			state.isLoading = false
		})
		.addCase(getWorkers.rejected, (state, {payload}) => {
			state.isLoading = false
		})
	}
})

export const workers = (state) => state.workers

export default workersSlice.reducer

