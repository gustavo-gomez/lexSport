import React from 'react'
import '../scss/components/sidebar.scss'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useNavigate} from "react-router-dom"
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
import Toolbar from "@mui/material/Toolbar"
import {generalSettings, toggleDrawer} from "../slices/generalSettingsSlice"
import logo from '../images/lex_sport.png'

const drawerWidth = 240

const menuOptions = [
	{
		name: 'Graficos',
		icon: <DashboardOutlinedIcon/>,
		path: '/dashboard'
	},
	{
		name: 'Costureras',
		icon: <PersonOutlineOutlinedIcon/>,
		path: '/workers'
	},
	{
		name: 'Productos',
		icon: <Inventory2OutlinedIcon/>,
		path: '/products'
	},
	{
		name: 'Historial',
		icon: <SummarizeOutlinedIcon/>,
		path: '/historial'
	}
]

const SideBar = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const {isDrawerOpen} = useSelector(generalSettings)
	const dispatch = useDispatch()
	const currentPath = location.pathname

	const drawer = (
		<div>
			<Toolbar>
				<Box display="flex" alignItems="center" p={1}>
					<Box flexGrow={1}>
						<img
							src={logo}
							alt="logo"
							style={{width: '98%'}}
							loading={'lazy'}
						/>
					</Box>
				</Box>
			</Toolbar>
			<Divider/>
			<List>
				{
					menuOptions.map(({name, icon, path}) => (
						<ListItem
							button
							key={name}
							onClick={() => {
								dispatch(toggleDrawer())
								navigate(path)
							}}
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
					))
				}
			</List>
		</div>
	)

	return (
		<Box
			component="nav"
			sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
			aria-label="mailbox folders"
		>
			{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
			<Drawer
				// container={container}
				variant="temporary"
				open={isDrawerOpen}
				onClose={() => dispatch(toggleDrawer())}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: {xs: 'block', sm: 'none'},
					'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: {xs: 'none', sm: 'block'},
					'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	)
}

export default SideBar
