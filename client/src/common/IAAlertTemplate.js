import React from 'react'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { positions, transitions } from 'react-alert'
import '../scss/components/alertmessage.scss'
import isEmpty from 'lodash/isEmpty'

export const ALERT_OPTIONS = {
	position: positions.TOP_RIGHT,
	timeout: 3000,
	offset: '30px',
	transition: transitions.FADE,
	containerStyle: {
		zIndex: 100,
	},
}

export const ALERT_TYPES = {
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning'
}

const ALERT_BACKGROUNDS = {
	[ALERT_TYPES.SUCCESS]: '#7ad97a',
	[ALERT_TYPES.ERROR]: '#fcedec',
	[ALERT_TYPES.WARNING]: '#fef4e5'
}
// TODO: review how to use a custom template and be able to show it, now works just with basic template
const IAAlertTemplate = ({ options, message }) => {
	console.log('options: ', options)
	console.log('message: ', message)
	const getIcon = (type) => {
		switch (type) {
			case ALERT_TYPES.SUCCESS:
				return <CheckCircleOutlinedIcon color={'primary'}/>
			case ALERT_TYPES.WARNING:
				return <WarningAmberOutlinedIcon color={'warning'}/>
			case ALERT_TYPES.ERROR:
				return <ErrorOutlineOutlinedIcon color={'error'}/>
			default:
				return <CheckCircleOutlinedIcon color={'primary'}/>
		}
	}

	return (
		<div
			className={'alert-container'}
			style={{ backgroundColor: ALERT_BACKGROUNDS[options.type] }}
		>
			{getIcon(options.type)}
			<span>
				{
					isEmpty(message) ?
						'Ocurrió un error' :
						message
				}
			</span>
		</div>
	)
}

export default IAAlertTemplate
