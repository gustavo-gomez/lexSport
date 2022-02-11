import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

export const ALERT_MESSAGE_SEVERITY = {
	SUCCESS: 'success',
	ERROR: 'error',
	INFO: 'info',
	WARNING: 'warning',
}

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const IAAlertMessage = ({severity, message}) => {

	const [open, setOpen] = React.useState(true)

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	return (
		<Snackbar
			open={open}
			autoHideDuration={4000}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
		>
			<Alert
				severity={severity}
				sx={{width: '100%'}}>
				{message}
			</Alert>
		</Snackbar>
	)
}

export default IAAlertMessage
