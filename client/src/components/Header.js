import React from 'react'
import '../scss/components/header.scss'
import { useDispatch, useSelector } from 'react-redux'
import { auth, logout } from '../slices/authSlice'
import { toggleDrawer } from '../slices/generalSettingsSlice'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'

const lightColor = 'rgba(255, 255, 255, 0.7)'
const drawerWidth = 240

function HideOnScroll(props) {
	const { children, window } = props
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
	})

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	)
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
}

const Header = () => {
	const { loggedUser } = useSelector(auth)
	const { firstName = '', lastName = '' } = loggedUser || {}
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const logOut = () => {
		navigate('/')
		dispatch(logout())
	}

	return (
		<HideOnScroll>
			<AppBar
				color="primary"
				position="sticky"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
					zIndex: 1
				}}
				className={'header-container'}
				elevation={0}
			>
				<Toolbar
					className={'toolbar'}
				>
					<Typography variant="h6" noWrap component="div">
						{`${firstName} ${lastName}`}
					</Typography>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={() => dispatch(toggleDrawer())}
						sx={{ mr: 2, display: { md: 'none' } }}
					>
						<MenuIcon/>
					</IconButton>
				</Toolbar>
			</AppBar>
		</HideOnScroll>
	)
}

export default Header
