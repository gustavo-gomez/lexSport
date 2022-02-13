import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import '../scss/components/ialoader.scss'
import PropTypes from 'prop-types'

const IASelect = ({ data, textToShow, value, onChange, label, isRequired, error, helperText }) => {

	if (data?.length === 0)
		return null
	return (
		<Autocomplete
			options={data}
			getOptionLabel={textToShow}
			id="disable-close-on-select"
			// clearOnEscape
			value={value}
			onChange={(event, newValue) => {
				event.preventDefault()
				onChange(newValue)
			}}
			renderInput={(params) => {
				console.log('params', params)
				return (
					<TextField
						{...params}
						label={label}
						variant="standard"
						required={isRequired}
						error={error}
						helperText={helperText}
					/>
				)
			}
			}
		/>
	)
}

export default IASelect

IASelect.defaultProps = {
	data: [],
	textToShow: (option) => {
	},
	value: null,
	onChange: () => {
	},
	label: '',
	isRequired: false,
	error: false,
	helperText: '',
}

IASelect.propTypes = {
	data: PropTypes.array,
	textToShow: PropTypes.func,
	value: PropTypes.any,
	onChange: PropTypes.func,
	label: PropTypes.string,
	isRequired: PropTypes.bool,
	error: PropTypes.bool,
	helperText: PropTypes.string,
}
