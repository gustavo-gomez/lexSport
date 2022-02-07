import {createSlice} from '@reduxjs/toolkit'

const initialState = {
	isDrawerOpen: false,
}

export const generalSettingsSlice = createSlice({
	name: 'generalSettings',
	initialState,
	reducers: {
		toggleDrawer: (state, action) => {
			state.isDrawerOpen = !state.isDrawerOpen
		},
	}
})


export const {toggleDrawer} = generalSettingsSlice.actions

export const generalSettings = (state) => state.generalSettings

export default generalSettingsSlice.reducer

