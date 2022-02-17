import React from 'react'
import '../scss/components/header.scss'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../slices/authSlice'
import { generalSettings, toggleDrawer } from '../slices/generalSettingsSlice'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'

const lightColor = 'rgba(255, 255, 255, 0.7)';
const drawerWidth = 240;

function HideOnScroll(props) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
	});

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

const Header = () => {
	// const {loggedUser: {first_name, last_name, role_admin}} = useSelector(auth)
	// const isAdmin = role_admin === 1
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {isDrawerOpen} = useSelector(generalSettings)

	const logOut = () => {
		navigate('/')
		dispatch(logout())
	}

	return (
		<React.Fragment>
			<HideOnScroll>
				<AppBar
					color="primary"
					position="sticky"
					sx={{
						width: {sm: `calc(100% - ${drawerWidth}px)`},
						ml: {sm: `${drawerWidth}px`},
					}}
					elevation={0}
				>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(toggleDrawer())}
							sx={{ mr: 2, display: { sm: 'none' } }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" noWrap component="div">
							Responsive drawer
						</Typography>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
		</React.Fragment>
	);
}

export default Header
