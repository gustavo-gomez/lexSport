import React from 'react'
import '../scss/components/header.scss'
import {useDispatch, useSelector} from 'react-redux'
import {auth, logout} from "../slices/authSlice";
import {toggleDrawer, generalSettings} from "../slices/generalSettingsSlice";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const lightColor = 'rgba(255, 255, 255, 0.7)';
const drawerWidth = 240;

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
			<AppBar
				color="primary"
				position="sticky"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
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
		</React.Fragment>
	);
}

export default Header
