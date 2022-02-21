import React from 'react'
import '../scss/components/ialoader.scss'
import { useDimension } from '../utils/useDimension'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'
import DateAdapter from '@mui/lab/AdapterMoment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { MOBILE_WIDTH } from '../utils/utils'

const IATimeDatePicker = ({ value, label, handleChange, defaultStartDate }) => {

	const { width } = useDimension()

	const props = {
		label,
		// inputFormat: 'MM/DD/yyyy',
		inputFormat: 'DD/MM/yyyy',
		format: 'DD/MM/yyyy',
		value,
		onChange: handleChange,
		renderInput: (params) => <TextField label={ 'hola'} {...params} readOnly/>
	}
	return (
		<LocalizationProvider dateAdapter={DateAdapter}>
			{
				width >= MOBILE_WIDTH ?
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
