import React, {useState} from 'react'
import '../scss/components/login.scss'
import '../scss/base/base.scss'
import AlertMessage, {ALERT_MESSAGE_SEVERITY} from "./AlertMessage"
import {isValidEmail} from "../utils/utils"
import {useDispatch, useSelector} from 'react-redux'
import {auth, AUTH_TOKEN_KEY, login, signUp} from "../slices/authSlice"
import {
	Redirect,
} from "react-router-dom"
import {hashPassword} from "../utils/passUtils"
import jwtDecode from "jwt-decode"
import isEmpty from "lodash/isEmpty"

const initialData = {
	email: '',
	password: '',
	confirmPassword: '',
	isAdmin: false,
	firstName: '',
	lastName: ''
}

const Login = () => {
	const [data, setData] = useState({...initialData})
	const [isSignIn, setIsSignIn] = useState(true)
	const [message, setMessage] = useState(null)
	const {error, successMessage} = useSelector(auth)
	const dispatch = useDispatch()
	
	const token = localStorage.getItem(AUTH_TOKEN_KEY)
	if (token !== null) {
		const user = jwtDecode(token)
		return (
			<Redirect to={`/timezones/${user.id}`}/>
		)
	}
	
	const submit = async () => {
		hashPassword(data.password)
		if (isValidForm()) {
			if (isSignIn) {
				dispatch(login({email: data.email, password: data.password}))
			} else {
				dispatch(signUp({
					user: {
						email: data.email,
						password: hashPassword(data.password),
						firstName: data.firstName,
						lastName: data.lastName,
						roleAdmin: data.isAdmin
					}
				}))
				setMessage(null)
				changeAction(true)
			}
		}
	}
	
	const isValidForm = () => {
		let err = null
		if (isSignIn) {
			if (data.email === '' || !isValidEmail(data.email)) err = 'Incorrect Email'
			else if (data.password === '') err = 'Password must not be empty'
		} else {
			if (data.email === '' || !isValidEmail(data.email)) err = 'Incorrect Email'
			else if (
				isEmpty(data.email) ||
				isEmpty(data.password) ||
				isEmpty(data.confirmPassword) ||
				isEmpty(data.firstName) ||
				isEmpty(data.lastName)) {
				err = 'All fields are required'
			} else if (data.password !== data.confirmPassword)
				err = 'Passwords do not match'
		}
		setMessage(err)
		return err === null
	}
	
	const onChange = (event) => {
		setMessage(null)
		const name = event.target.name
		let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
		
		setData(prevState => ({
			...prevState,
			[name]: value
		}))
	}
	
	const changeAction = (signIn) => {
		setData({...initialData})
		document.getElementById("password").value = ''
		setIsSignIn(signIn)
	}
	
	return (
		<div className='page-container'>
			<div className='login'>
				<div className={'actions'}>
					<label onClick={() => changeAction(true)} className={isSignIn ? 'selected' : ''}> SIGN IN</label>
					<label onClick={() => changeAction(false)} className={!isSignIn ? 'selected' : ''}> SIGN UP</label>
				</div>
				<div className={'fields'}>
					<label>
						Email
					</label>
					<input
						id={'login-email'}
						name='email'
						type='text'
						value={data?.email}
						onChange={onChange}
					/>
				</div>
				<div className={'fields'}>
					<label>
						Password
					</label>
					<input
						id='password'
						name='password'
						type='password'
						onChange={onChange}
					/>
				</div>
				{
					!isSignIn &&
					<>
						<div className={'fields'}>
							<label>
								Confirm Password
							</label>
							<input
								name='confirmPassword'
								type='password'
								onChange={onChange}
							/>
						</div>
						<div className={'fields'}>
							<label>
								Name
							</label>
							<input
								name='firstName'
								type='text'
								onChange={onChange}
								value={data.firstName}
							/>
						</div>
						<div className={'fields'}>
							<label>
								Last Name
							</label>
							<input
								name='lastName'
								type='text'
								onChange={onChange}
								value={data.lastName}
							/>
						</div>
						<label className={'is-admin'}>
							<input
								type="checkbox"
								name="isAdmin"
								onChange={onChange}
								checked={data?.isAdmin}
							/>
							{'Admin ?'}
						</label>
					</>
				}
				<button onClick={submit}>{isSignIn ? 'Log in' : 'Register'}</button>
			</div>
			{
				(message || error || successMessage) &&
				<AlertMessage
					message={message || error || successMessage}
					severity={(message || error) ? ALERT_MESSAGE_SEVERITY.ERROR : ALERT_MESSAGE_SEVERITY.SUCCESS}
				/>
			}
		</div>
	)
}

export default Login
