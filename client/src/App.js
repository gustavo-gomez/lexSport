import React, { Suspense, useEffect, useState, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/index.scss'
import { useDispatch } from 'react-redux'
import { AUTH_TOKEN_KEY, updateLoggedUser } from './slices/authSlice'
import jwtDecode from 'jwt-decode'
import { OPERATOR_ROLES, ROLES } from './utils/utils'

const Login = lazy(() => import('./components/Login'))
const History = lazy(() => import('./components/History'))
const DashboardProducts = lazy(() => import('./components/DashboardProducts'))
const Products = lazy(() => import('./components/Products'))
const Workers = lazy(() => import('./components/Workers'))
const NewHistory = lazy(() => import('./components/NewHistory'))
const Schedule = lazy(() => import('./components/Schedule'))
const Payments = lazy(() => import('./components/Payments'))
const NewSchedule = lazy(() => import('./components/NewSchedule'))
const Operators = lazy(() => import('./components/Operators'))
const DashboardWorkers = lazy(() => import('./components/DashboardWorkers'))
const Header = lazy(() => import('./components/Header'))
const SideBar = lazy(() => import('./components/SideBar'))


const App = () => {

	const dispatch = useDispatch()
	const [user, setUser] = useState()

	useEffect(() => {
		const isToken = localStorage.getItem(AUTH_TOKEN_KEY) !== null
		if (isToken) {
			const user = jwtDecode(localStorage.getItem(AUTH_TOKEN_KEY))
			setUser(user)
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

	const getRoutesByPermission = () => {

		let fillAndMakesRoutes = null
		let scheduleRoutes = null
		const userPermissions = user?.permission?.split(',') // support more than one permission
		console.log(userPermissions)
		if (userPermissions.includes(OPERATOR_ROLES.FILL) || userPermissions.includes(OPERATOR_ROLES.MAKES)) {
			fillAndMakesRoutes = (
				<>
					<Route
						path="/historial"
						element={
							<PrivateRedirect redirectTo="/">
								<History/>
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
				</>
			)
		}

		if (userPermissions.includes(OPERATOR_ROLES.SCHEDULE)) {
			scheduleRoutes = (
				<>
					<Route
						path="/horarios"
						element={
							<PrivateRedirect redirectTo="/">
								<Schedule/>
							</PrivateRedirect>
						}
					/>
					<Route
						path="/horarios/nuevo"
						element={
							<PrivateRedirect redirectTo="/">
								<NewSchedule/>
							</PrivateRedirect>
						}
					/>
				</>
			)
		}
		return(
			<>
				{fillAndMakesRoutes}
				{scheduleRoutes}
			</>
		)
	}

	const getRoutesByRole = () => {
		switch (user?.role) {
			case ROLES.ADMIN:
				return (
					<>
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
							path="/horarios"
							element={
								<PrivateRedirect redirectTo="/">
									<Schedule/>
								</PrivateRedirect>
							}
						/>
						<Route
							path="/horarios/nuevo"
							element={
								<PrivateRedirect redirectTo="/">
									<NewSchedule/>
								</PrivateRedirect>
							}
						/>
						<Route
							path="/operadores"
							element={
								<PrivateRedirect redirectTo="/">
									<Operators/>
								</PrivateRedirect>
							}
						/>
					</>
				)
			case ROLES.OPERATOR:
				return getRoutesByPermission()
		}
	}

	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" element={<Login/>}/>
					{getRoutesByRole()}
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
