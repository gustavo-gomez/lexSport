import React from 'react'
import '../scss/components/sidebar.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import Toolbar from '@mui/material/Toolbar'
import { generalSettings, toggleDrawer } from '../slices/generalSettingsSlice'
import logo from '../images/lex_sport.png'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { auth, logout } from '../slices/authSlice'

const drawerWidth = 240

const menuOptions = [
	{
		name: 'Historial',
		icon: <SummarizeOutlinedIcon/>,
		path: '/historial',
		onlyAdmin: false
	},
	{
		name: 'Graficos',
		icon: <DashboardOutlinedIcon/>,
		onlyAdmin: true
	},
	{
		type: 'child',
		name: 'Productos',
		path: '/dashboard/productos',
		onlyAdmin: true
	},
	{
		type: 'child',
		name: 'Costureras',
		path: '/dashboard/trabajadores',
		onlyAdmin: true
	},
	{
		name: 'Pagos',
		icon: <PaymentsOutlinedIcon/>,
		path: '/pagos',
		onlyAdmin: true
	},
	{
		name: 'Costureras',
		icon: <PersonOutlineOutlinedIcon/>,
		path: '/trabajadores',
		onlyAdmin: true
	},
	{
		name: 'Productos',
		icon: <Inventory2OutlinedIcon/>,
		path: '/productos',
		onlyAdmin: true
	},
]

const SideBar = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { isDrawerOpen } = useSelector(generalSettings)
	const { loggedUser } = useSelector(auth)
	const isAdmin = loggedUser?.roleAdmin === 1
	const dispatch = useDispatch()
	const currentPath = location.pathname

	const drawer = (
		<div
			style={{ height: '100%' }}
		>
			<Toolbar>
				<Box display="flex" alignItems="center" p={1}>
					<Box flexGrow={1}>
						<img
							src={logo}
							alt="logo"
							style={{ width: '98%' }}
							loading={'lazy'}
						/>
					</Box>
				</Box>
			</Toolbar>
			<Divider/>
			<List>
				{
					menuOptions.map(({ name, icon, path, type, onlyAdmin }, index) => {
						if (onlyAdmin && !isAdmin) return null
							return (

								<ListItem
									button
									key={`${name}-${index}`}
									onClick={() => {
										dispatch(toggleDrawer())
										navigate(path)
									}}
									style={type === 'child' ? {
										marginLeft: '1.5rem',
									} : {}}
								>
									<ListItemIcon
										className={currentPath === path ? 'selected-menu' : ''}
									>
										{icon}
									</ListItemIcon>
									<ListItemText
										primary={name}
										className={currentPath === path ? 'selected-menu' : ''}
									/>
								</ListItem>
							)
					})
				}
			</List>
			<List
				style={{
					bottom: 0,
					position: 'fixed',
				}}
			>
				<ListItem
					button
					key={'logout'}
					onClick={() => {
						dispatch(logout())
					}}
				>
					<ListItemIcon
					>
						<LogoutOutlinedIcon/>
					</ListItemIcon>
					<ListItemText
						primary={'Cerrar sesión'}
					/>
				</ListItem>
			</List>
		</div>
	)

	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			<Drawer
				// container={container}
				variant="temporary"
				open={isDrawerOpen}
				onClose={() => dispatch(toggleDrawer())}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					// display: {xs: 'block', sm: 'none'},
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				anchor="right"
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					// display: {xs: 'none', sm: 'block'},
					display: { xs: 'none', md: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	)
}

export default SideBar
