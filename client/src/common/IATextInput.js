import React from 'react'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'

const IATextInput = ({
	                     isRequired,
	                     disabled,
	                     id,
	                     label,
	                     placeholder,
	                     type,
	                     helperText,
	                     error,
	                     value,
	                     onChangeText,
	                     name,
	                     testId
                     }) => {

	return (
		<TextField
			id={id}
			required={isRequired}
			disabled={disabled}
			label={label}
			placeholder={placeholder}
			type={type}
			helperText={helperText}
			error={error}
			value={value}
			variant="standard"
			onChange={onChangeText}
			name={name}
			data-testid={'qwertyuil'}

		/>
	)
}

export default IATextInput

IATextInput.defaultProps = {
	isRequired: false,
	disabled: false,
	id: '',
	label: '',
	placeHolder: '',
	type: 'text',
	helperText: '',
	error: false,
	value: '',
	onChangeText: () => {
	},
	name: ''
}

IATextInput.prototype = {
	isRequired: PropTypes.bool,
	disabled: PropTypes.bool,
	id: PropTypes.string,
	label: PropTypes.string,
	placeHolder: PropTypes.string,
	type: PropTypes.string,
	helperText: PropTypes.string,
	error: PropTypes.bool,
	value: PropTypes.string,
	onChangeText: PropTypes.func,
	name: PropTypes.string
}
