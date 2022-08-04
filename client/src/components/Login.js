import React, { useEffect, useState } from 'react'
import '../scss/base/base.scss'
import { useDispatch, useSelector } from 'react-redux'
import { auth, AUTH_TOKEN_KEY, login } from '../slices/authSlice'
import jwtDecode from 'jwt-decode'
import LoadingButton from '@mui/lab/LoadingButton'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import logo from '../images/lex_sport.png'
import { OPERATOR_ROLES, ROLES } from '../utils/utils'
import { useAlert } from 'react-alert'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

const Login = () => {
	const { isLoading } = useSelector(auth)
	const [showPassword, setShowPassword] = useState(false)
	const dispatch = useDispatch()
	const theme = createTheme()
	const navigate = useNavigate()
	const alert = useAlert()

	useEffect(() => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY)
		if (token !== null) {
			const user = jwtDecode(token)
			const userPermissions = user?.permission?.split(',')

			if (user?.role === ROLES.ADMIN || user?.role === ROLES.OPERATOR) { // only those roles can login
				// if (user?.permission === OPERATOR_ROLES.SCHEDULE)
				if (userPermissions?.includes(OPERATOR_ROLES.SCHEDULE))
					navigate('/horarios')
				else
					navigate('/historial')
			}
		}
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault()
		const data = new FormData(e.currentTarget)

		dispatch(login({
			email: data.get('email'),
			password: data.get('password'),
			cb: (message) => alert.error(message)
		}))
	}

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline/>
				<Box
					sx={{
						marginTop: 20,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Box display="flex" alignItems="center" p={1}>
						<Box flexGrow={1}>
							<img
								src={logo}
								alt="logo"
								style={{ width: '98%' }}
								loading={'lazy'}
							/>
						</Box>
					</Box>
					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ mt: 1 }
						}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Usuario"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<FormControl sx={{ width: '100%' }} variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
							<OutlinedInput
								margin="normal"
								required
								fullWidth
								name="password"
								label="Clave"
								type={showPassword ? 'text' : 'password'}
								id="password"
								autoComplete="current-password"
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowPassword(prevState => !prevState)}
											onMouseDown={() => {
											}}
											edge="end"
										>
											{showPassword ? <VisibilityOff/> : <Visibility/>}
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
						<LoadingButton
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							loading={isLoading}
							loadingIndicator="Loading..."
						>
							Iniciar Sesión
						</LoadingButton>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	)
}

export default Login
