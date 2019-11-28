import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

import AccountCircle from '@material-ui/icons/AccountCircle'
import RefreshIcon from '@material-ui/icons/Refresh'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Divider from '@material-ui/core/Divider'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

import Metadata from './Metadata'
import ResultsList from './ResultsList'
import LyricsView from './LyricsView'

import Grid from '@material-ui/core/Grid'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useSnackbar } from 'notistack'
import About from './About'

const keyMap = {
    COPY: "alt+c",
    reload: "alt+r"
}


function AboutDialog(props) {
    const classes = useStyles();
    const { onClose, open } = props;

    const handleClose = () => {
        onClose()
    };

    return (
        <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={handleClose}>
            <DialogTitle id="simple-dialog-title">SpoGen</DialogTitle>
            <Box p={3}>
                <About />
            </Box>
        </Dialog>
    );
}

function AboutItem() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (<>
        <MenuItem onClick={handleClickOpen}>About...</MenuItem>
        <AboutDialog open={open} onClose={handleClose} />
    </>)
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    list: {
        position: "sticky"
    }
}));

function UserMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Tooltip title={props.user.display_name || props.user.id}>
                <IconButton aria-describedby={id} color="inherit" onClick={handleClick}>
                    <AccountCircle />
                </IconButton>
            </Tooltip>
            <Menu
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}

            >
                <MenuItem onClick={_ => { window.open(props.user.external_urls.spotify, '_blank') }}>
                    Go to user profile
                </MenuItem>
                <MenuItem onClick={_ => { document.location.href = "/api/session/delete" }}>
                    Sign out
                </MenuItem>
                <Divider />
                <AboutItem />

            </Menu>
        </div>
    );
}


export default function SpoGen(props) {

    const classes = useStyles()
    const [playbackStatus, setPlaybackStatus] = useState({
        loading: true,
        isPlaying: true,
        isPrivate: null,
        item: null
    })
    const [currentItem, setCurrentItem] = useState(null)
    const [plainText, setPlainText] = useState(null)

    const [loadingLyrics, setLoadingLyrics] = useState(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const fetch = async () => {
        setPlaybackStatus({ loading: true })
        setCurrentItem(null)
        setLoadingLyrics(true)
        const result = (await axios.get("/api/spotify/playbackInfo")).data
        setPlaybackStatus({ loading: false, ...result })
    }

    const liteFetch = async () => {

        const result = (await axios.get("/api/spotify/playbackInfo")).data
        if (playbackStatus.isPlaying == true && playbackStatus.item.id !== result.item.id) {
            setPlaybackStatus({ loading: true })
            setLoadingLyrics(true)
            setCurrentItem(null)
            setPlaybackStatus({ loading: false, ...result })
        }

    }

    useEffect(() => {
        fetch()
        
    }, [])

    useEffect(() => {
        const interval = setInterval(() => liteFetch(), 5000)
        return () => clearInterval(interval)
    }, [playbackStatus])

    const load = item => {
        if (item !== "nl") {
            console.log(item)
            setCurrentItem(item)
        }
    }

    const ptSet = text => {
        setPlainText(text)
    }

    const openExternal = () => {
        window.open(currentItem.url, "_blank")
    }


    return (
        <div className={classes.root}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        SpoGen
                    </Typography>
                    <Tooltip title="Copy lyrics to clipboard">
                        <CopyToClipboard text={plainText} onCopy={() => enqueueSnackbar("Copied to clipboard")}>
                            <IconButton color="inherit">
                                <FileCopyIcon />
                            </IconButton>
                        </CopyToClipboard>

                    </Tooltip>
                    <Tooltip title="Open in Genius.com">
                        <IconButton color="inherit" onClick={openExternal}>
                            <OpenInNewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh">
                        <IconButton color="inherit" onClick={fetch}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <UserMenu user={props.auth.user} />
                </Toolbar>
            </AppBar>
            <Box py={3}>
                <Container>
                    <Box>
                        <Metadata pInfo={playbackStatus} reload={fetch} />
                    </Box>
                    <Grid container>
                        <Grid item xs={12} sm>
                            {!currentItem ? <></> : <LyricsView loadLyrics={ptSet} item={currentItem} loading={loadingLyrics}></LyricsView>}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ResultsList pInfo={playbackStatus} load={load}></ResultsList>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    )
}