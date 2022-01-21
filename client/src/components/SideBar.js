import React from 'react'
import '../scss/components/sidebar.scss'
import {useSelector} from 'react-redux'
import {auth} from "../slices/authSlice";
import {useHistory, useLocation} from "react-router-dom";


const SideBar = () => {
	const {loggedUser} = useSelector(auth)
	const {role_admin} = loggedUser
	const isAdmin = role_admin === 1
	const history = useHistory()
	const location = useLocation()
	
	return (
		<div className='sidebar-container'>
			<div className={'menu'}>
				<span
					className={location.pathname.includes('profile') ? 'selected' : ''}
					onClick={() => history.push('/profile')}
				>
					Profile
				</span>
				<span
					className={location.pathname.includes('timezones') ? 'selected' : ''}
					onClick={() => history.push('/timezones')}
				>
					Time Zones
				</span>
				{
					isAdmin &&
					<span
						className={location.pathname.includes('users') ? 'selected' : ''}
						onClick={() => history.push('/users')}
					>
					Users
				</span>
				}
			</div>
		</div>
	);
}

export default SideBar
