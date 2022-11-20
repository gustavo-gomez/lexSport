import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import generalSettingsReducer from './slices/generalSettingsSlice'
// import workersReducer from './slices/workersSlice'
// import productsReducer from './slices/productsSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		generalSettings: generalSettingsReducer,
		// workers: workersReducer,
		// products: productsReducer
	},
})
