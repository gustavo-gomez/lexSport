import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import './scss/index.scss'
import { useDispatch } from 'react-redux'
import Header from './components/Header'
import SideBar from './components/SideBar'
import { AUTH_TOKEN_KEY } from './slices/authSlice'
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import Workers from './components/Workers'
import NewHistory from './components/NewHistory'
import History from './components/History'

const App = () => {

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
						path="/dashboard"
						element={
							<PrivateRedirect redirectTo="/">
								<Dashboard/>
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
						path="*"
						element={<Navigate to="/"/>}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App
