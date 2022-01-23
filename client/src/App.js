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
		const token = localStorage.getItem(AUTH_TOKEN_KEY)
		
		const isAuthUser = token !== null
		
		if (isAuthUser) return children
		else return <Navigate to={redirectTo}/>
		// dispatch(updateUser())
		// return (isAuthUser ? children : <Redirect to={redirectTo}>)
	};
	
	
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route index element={<Login/>}/>
					<Route
						path="/home"
						render={() => (
							<PrivateRedirect redirectTo="/login">
								<Home/>
							</PrivateRedirect>
						)}
					/>
					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
					{/*<Route path="*" element={<Login />} />*/}
					{/*<Route render={() => <Redirect to='/login'/>}/>*/}
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App
