import React from 'react'
import '../scss/components/sidebar.scss'
import {useSelector} from 'react-redux'
import {auth} from "../slices/authSlice";
import { useLocation} from "react-router-dom";


const Dashboard = () => {
	// const {loggedUser} = useSelector(auth)
	// const {role_admin} = loggedUser
	// const isAdmin = role_admin === 1
	// const navigate = useNavigate()
	// const location = useLocation()

	return (
		<div >
			home
		</div>
	);
}

export default Dashboard
