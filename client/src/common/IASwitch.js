import React from 'react'
import PropTypes from "prop-types"
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel';

const IASwitch = ({checked, onChange, name, label}) => {

	return (
		<FormControlLabel
			control={
				<Switch
					checked={checked}
					onChange={onChange}
					name={name}
				/>
			}
			label={label}
		/>
	)
}

export default IASwitch

IASwitch.defaultProps = {
	checked: false,
	onChange: () => {},
	name: '',
	label: ''
}

IASwitch.prototypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	name: PropTypes.string,
	label: PropTypes.string
}
