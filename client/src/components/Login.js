import React, {useState} from 'react'
import '../scss/components/login.scss'
import '../scss/base/base.scss'
// import AlertMessage, {ALERT_MESSAGE_SEVERITY} from "./AlertMessage"
// import {isValidEmail} from "../utils/utils"
import {useDispatch, useSelector} from 'react-redux'
import {auth, AUTH_TOKEN_KEY, login} from "../slices/authSlice"
import {
	Navigate,
} from "react-router-dom"
import jwtDecode from "jwt-decode"
import isEmpty from "lodash/isEmpty"
import {hashPassword} from "../utils/passUtils";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';

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
	const theme = createTheme();
	
	const token = localStorage.getItem(AUTH_TOKEN_KEY)
	if (token !== null) {
		const user = jwtDecode(token)
		return (
			<Navigate to={`/timezones/${user.id}`}/>
		)
	}
	
	// const submit = async () => {
	// 	hashPassword(data.password)
	// 	if (isValidForm()) {
	// 		if (isSignIn) {
	// 			dispatch(login({email: data.email, password: data.password}))
	// 		} else {
	// 			dispatch(signUp({
	// 				user: {
	// 					email: data.email,
	// 					password: hashPassword(data.password),
	// 					firstName: data.firstName,
	// 					lastName: data.lastName,
	// 					roleAdmin: data.isAdmin
	// 				}
	// 			}))
	// 			setMessage(null)
	// 			changeAction(true)
	// 		}
	// 	}
	// }
	
	const isValidForm = () => {
		let err = null
		// if (data.email === '' || !isValidEmail(data.email)) err = 'Incorrect Email'
		// else if (data.password === '') err = 'Password must not be empty'
		//
		// setMessage(err)
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
	
	
	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline/>
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					{/*<Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>*/}
					{/*	<LockOutlinedIcon/>*/}
					{/*</Avatar>*/}
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box component="form" onSubmit={() => {}} noValidate sx={{mt: 1}}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary"/>}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{mt: 3, mb: 2}}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="#" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	)
}

export default Login
