import React, { useEffect } from 'react'
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

const Login = () => {
	const { isLoading } = useSelector(auth)
	const dispatch = useDispatch()
	const theme = createTheme()
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY)
		if (token !== null) {
			const user = jwtDecode(token)
			if (user?.role === ROLES.ADMIN || user?.role === ROLES.OPERATOR) {
				if (user?.permission === OPERATOR_ROLES.SCHEDULE)
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
			password: data.get('password')
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
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Clave"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
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
