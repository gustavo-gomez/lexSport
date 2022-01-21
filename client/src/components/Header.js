import React from 'react'
import '../scss/components/header.scss'
import {useDispatch, useSelector} from 'react-redux'
import {auth, logout} from "../slices/authSlice";
import {useHistory} from "react-router-dom";

const Header = () => {
	const {loggedUser: {first_name, last_name, role_admin}} = useSelector(auth)
	const isAdmin = role_admin === 1
	const dispatch = useDispatch()
	const history = useHistory()
	
	const logOut = () => {
		history.push('/login')
		dispatch(logout())
	}
	
	return (
		<div className={'header-container'}>
			<p>{`${first_name} ${last_name} - ${isAdmin ? 'Admin' : 'User'}`}</p>
			<h1>Time zones management</h1>
			<span onClick={logOut}>Log Out</span>
		</div>
	);
}

export default Header
