import React, {useState, useEffect, Suspense} from 'react'
import axios from 'axios'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { withStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green, deepPurple, orange } from '@material-ui/core/colors';

import CssBaseline from '@material-ui/core/CssBaseline'

import { SnackbarProvider } from 'notistack'

import About from './About'
import useMediaQuery from '@material-ui/core/useMediaQuery';

const SpoGen = React.lazy(() => import('./SpoGen'));

const SignInButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green.A400),
    backgroundColor: green.A400,
    '&:hover': {
      backgroundColor: green.A200,
    }
  },
}))(Button);


function FallbackLoader() {
  return (<Container>
    <Box display="flex" justifyContent="center" m={2}>
      <CircularProgress />
    </Box>
  </Container>)
}

function App() {

  var app;
  const [authStatus, setAuthStatus] = useState({ loading: true, authenticated: false, user: null })

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: deepPurple,
          secondary: {
            main: orange.A400,
          },
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );


  useEffect(() => {
    const fetch = async () => {
      const result = (await axios.get("/api/session/info")).data
      setAuthStatus({ loading: false, ...result })
    }
    fetch()
  }, [])

  if (authStatus.loading) {
    app = (
      <FallbackLoader />
    )
  } else {
    if (authStatus.authenticated) {
      app = (<Suspense fallback={ <FallbackLoader />}><SpoGen auth={authStatus} /></Suspense>)
    } else {
      app = (
        <Container>
          <Box m={4}>
            <Typography variant="h3" gutterBottom component="h1">SpoGen</Typography>
            <Typography>SpoGen uses your Spotify account to show you the lyrics of the song you're listening to.</Typography>
            <Box my={3}>
              <SignInButton onClick={_ => { document.location.href = "/api/session/new" }} variant="contained">Sign in with Spotify</SignInButton>
            </Box>
            <About />
          </Box>
        </Container>
      )
    }
  }

  return (<ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3} disableWindowBlurListener>
      <CssBaseline />
      {app}
    </SnackbarProvider>
  </ThemeProvider>);
}

export default App
