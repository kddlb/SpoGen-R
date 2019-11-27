import React, { useState, useEffect } from 'react'
import axios from 'axios'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';


import About from './About'
import SpoGen from './SpoGen'

const SignInButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green.A400),
    backgroundColor: green.A400,
    '&:hover': {
      backgroundColor: green.A200,
    }
  },
}))(Button);

function App() {
  const [authStatus, setAuthStatus] = useState({ loading: true, authenticated: false, user: null })

  useEffect(() => {
    const fetch = async () => {
      const result = (await axios.get("/api/session/info")).data
      setAuthStatus({ loading: false, ...result })
    }
    fetch()
  }, [])

  if (authStatus.loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" m={2}>
          <CircularProgress />
        </Box>
      </Container>
    )
  } else {
    if (authStatus.authenticated) { 
      return (<SpoGen auth={authStatus} />)
    } else {
      return (
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
}

export default App
