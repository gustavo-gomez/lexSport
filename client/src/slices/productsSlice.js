import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getAllProductsAPI} from "../utils/apiUtils"

const initialState = {
	productList: [],
	activeProductList: [],
	isLoading: null,
}

export const getAllProducts = createAsyncThunk(
	'products/getProducts',
	async (params, thunkAPI) => {
		const {data, responseMessage, isError} = await getAllProductsAPI()
		if (!isError) {
			return data
		} else {
			return thunkAPI.rejectWithValue({responseMessage})
		}
	},
)

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllProducts.pending, (state, {payload}) => {
				state.isLoading = true
			})
			.addCase(getAllProducts.fulfilled, (state, {payload}) => {
				const {products} = payload
				state.productList = products
				state.activeProductList = products.filter(product => product.hidden === 0)
				state.isLoading = false
			})
			.addCase(getAllProducts.rejected, (state, {payload}) => {
				state.isLoading = false
			})
	}
})

export const products = (state) => state.products

export default productsSlice.reducer
