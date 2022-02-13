import React from 'react'
import '../scss/components/ialoader.scss'
import { useDimension } from '../utils/useDimension'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'
import DateAdapter from '@mui/lab/AdapterMoment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const IATimeDatePicker = ({ value, label, handleChange }) => {

	const { width } = useDimension()

	const props = {
		label,
		// inputFormat: 'MM/DD/yyyy',
		format: 'MM/DD/yyyy',
		value,
		onChange: handleChange,
		renderInput: (params) => <TextField {...params} readOnly/>
	}
	return (
		<LocalizationProvider dateAdapter={DateAdapter}>
			{
				width >= 850 ?
					<DesktopDatePicker
						{...props}
					/>
					:
					<MobileDatePicker
						{...props}
					/>
			}
		</LocalizationProvider>
	)
}

export default IATimeDatePicker

IATimeDatePicker.defaultProps = {
	value: new Date(),
	label: '',
	handleChange: () => {
	}
}

IATimeDatePicker.propTypes = {
	value: PropTypes.instanceOf(Date),
	label: PropTypes.string,
	handleChange: PropTypes.func
}
