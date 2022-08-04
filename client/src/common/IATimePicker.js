import React from 'react'
import '../scss/components/ialoader.scss'
import { useDimension } from '../utils/useDimension'
import TimePicker from '@mui/lab/TimePicker'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'
import DateAdapter from '@mui/lab/AdapterMoment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { MOBILE_WIDTH } from '../utils/utils'

const IATimePicker = ({ value, label, handleChange }) => {

	const props = {
		ampm: false,
		label,
		value,
		onChange: handleChange,
		renderInput: (params) => <TextField {...params} />,
	}
	return (
		<LocalizationProvider dateAdapter={DateAdapter}>
			<TimePicker
				{...props}
			/>
		</LocalizationProvider>
	)
}

export default IATimePicker

IATimePicker.defaultProps = {
	value: new Date(),
	label: '',
	handleChange: () => {
	}
}

IATimePicker.propTypes = {
	value: PropTypes.instanceOf(Date),
	label: PropTypes.string,
	handleChange: PropTypes.func
}
