import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import './scss/index.scss'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import SideBar from './components/SideBar'
import { auth, AUTH_TOKEN_KEY, updateLoggedUser } from './slices/authSlice'
import DashboardProducts from './components/DashboardProducts'
import Products from './components/Products'
import Workers from './components/Workers'
import NewHistory from './components/NewHistory'
import History from './components/History'
import Payments from './components/Payments'
import jwtDecode from 'jwt-decode'
import DashboardWorkers from './components/DashboardWorkers'
import { ROLES } from './utils/utils'

const App = () => {

	const dispatch = useDispatch()
	const [isAdmin, setIsAdmin] = useState(false)
	// const { loggedUser } = useSelector(auth)

	useEffect(() => {
		const isToken = localStorage.getItem(AUTH_TOKEN_KEY) !== null
		if (isToken) {
			const user = jwtDecode(localStorage.getItem(AUTH_TOKEN_KEY))

			setIsAdmin(user?.role === ROLES.ADMIN)
			dispatch(updateLoggedUser(jwtDecode(localStorage.getItem(AUTH_TOKEN_KEY))))
		}
	}, [])

	const PrivateRedirect = ({ children, redirectTo }) => {
		return localStorage.getItem(AUTH_TOKEN_KEY) !== null
			?
			<>
				<Header/>
				<SideBar/>
				{children}
			</> :
			<Navigate to={redirectTo}/>
	}


	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" index element={<Login/>}/>
					<Route
						path="/dashboard/productos"
						element={
							<PrivateRedirect redirectTo="/">
								<DashboardProducts/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/dashboard/trabajadores"
						element={
							<PrivateRedirect redirectTo="/">
								<DashboardWorkers/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/trabajadores"
						element={
							<PrivateRedirect redirectTo="/">
								<Workers/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/productos"
						element={
							<PrivateRedirect redirectTo="/">
								<Products/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/historial/nuevo"
						element={
							<PrivateRedirect redirectTo="/">
								<NewHistory/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/historial"
						element={
							<PrivateRedirect redirectTo="/">
								<History/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/pagos"
						element={
							<PrivateRedirect redirectTo="/">
								<Payments/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="*"
						element={<Navigate to="/"/>}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App
