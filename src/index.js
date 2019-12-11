import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import CssBaseline from '@material-ui/core/CssBaseline'

import RuxTheme from './theme'
import { ThemeProvider } from '@material-ui/core/styles'

import { SnackbarProvider } from 'notistack'

ReactDOM.render(
    <ThemeProvider theme={RuxTheme}>
        <SnackbarProvider maxSnack={3} disableWindowBlurListener>
            <CssBaseline />
            <App />
        </SnackbarProvider>
    </ThemeProvider>
    , document.getElementById('root'))
