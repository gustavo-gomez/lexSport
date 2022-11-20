import React, { Suspense, useEffect, useState, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/index.scss'
import { useDispatch } from 'react-redux'
import { AUTH_TOKEN_KEY, updateLoggedUser } from './slices/authSlice'
import jwtDecode from 'jwt-decode'
import { OPERATOR_ROLES, ROLES } from './utils/utils'

const Login = lazy(() => import('./components/Login'))


const App = () => {

	const dispatch = useDispatch()
	const [user, setUser] = useState()

	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" element={<Login/>}/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App
