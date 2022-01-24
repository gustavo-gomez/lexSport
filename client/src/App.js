import React, {Fragment, Suspense} from "react"
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate
} from "react-router-dom"
import Login from "./components/Login"
import './scss/index.scss'
import {useDispatch} from "react-redux";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import {AUTH_TOKEN_KEY} from "./slices/authSlice";
import Home from "./components/Home";

const App = () => {
	
	const dispatch = useDispatch()
	
	const PrivateRedirect = ({children, redirectTo}) => {
		console.log('PrivateRedirect')
		const token = localStorage.getItem(AUTH_TOKEN_KEY)
		
		const isAuthUser = token !== null
		console.log('isAuthUser: ', isAuthUser)
		if (isAuthUser) return children
		else return <Navigate to={redirectTo}/>
		// dispatch(updateUser())
		// return (isAuthUser ? children : <Redirect to={redirectTo}>)
	};
	
	
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" index element={<Login/>}/>
					<Route
						path="/home"
						render={() => (
							<PrivateRedirect redirectTo="/">
								<Home/>
							</PrivateRedirect>
						)}
					/>
					// Default redirect to Login
					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App
