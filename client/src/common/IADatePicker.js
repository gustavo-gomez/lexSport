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

const IADatePicker = ({ value, label, handleChange, defaultStartDate }) => {

	const { width } = useDimension()

	const props = {
		label,
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

export default IADatePicker

IADatePicker.defaultProps = {
	value: new Date(),
	label: '',
	handleChange: () => {
	}
}

IADatePicker.propTypes = {
	value: PropTypes.instanceOf(Date),
	label: PropTypes.string,
	handleChange: PropTypes.func
}
