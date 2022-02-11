import React from 'react'
import Zoom from '@mui/material/Zoom'
import Fab from '@mui/material/Fab'
import {useTheme} from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import PropTypes from "prop-types";

const FloatingButton = ({onClick}) => {

	const theme = useTheme()

	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen,
	}
	return (
		<Zoom
			in={true}
			timeout={transitionDuration}
			style={{
				transitionDelay: `${transitionDuration.exit}ms`,
			}}
			unmountOnExit
		>
			<Fab
				style={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
				aria-label={'Nuevo'}
				color={'primary'}
				onClick={onClick}
			>
				<AddIcon/>
			</Fab>
		</Zoom>
	)
}

export default FloatingButton

FloatingButton.defaultProps = {
	onClick: () => {
	},
}
FloatingButton.propTypes = {
	onClick: PropTypes.func.isRequired,
}
