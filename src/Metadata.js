import React, {useState} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Hidden from '@material-ui/core/Hidden'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import IconButton from '@material-ui/core/IconButton'
import axios from 'axios'

import { withSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        alignItems: 'center'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto'
    },
    cover: {
        width: 150,
        height: 150
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    }
}));


export default withSnackbar(function Metadata(props) {

    const classes = useStyles()
    const [loading, setLoading] = useState(false)

    function spAction(action) {
        setLoading(true)
        axios.get("/api/spotify/action/" + action)
        setTimeout(function () {
            props.reload()
            setLoading(false)
        }, 1250)
    }

    if (props.pInfo.loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" m={2}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    } else if (!props.pInfo.isPlaying) {
        props.enqueueSnackbar("No player found.")
        return (
            <React.Fragment />
        )
    } else if (props.pInfo.isPrivate) {
        props.enqueueSnackbar("Turn Private Session off to use SpoGen.")
        return (
            <React.Fragment />
        )
    } else {
        return (

            <Card square className={classes.card}>
                <Hidden xsDown implementation="css">
                    <CardMedia
                        className={classes.cover}
                        image={props.pInfo.item.album.images[0].url}
                        title={`Album art for "${props.pInfo.item.album.name}" by ${props.pInfo.item.album.artists.map(x => x.name).join(", ")}`}
                    />
                </Hidden>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {props.pInfo.item.name}
                        </Typography>
                        <Typography variant="subtitle1">
                            {props.pInfo.item.artists.map(x => x.name).join(", ")}
                        </Typography>
                        <Typography variant="subtitle2">
                            {props.pInfo.item.album.name}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                    <IconButton aria-label="previous" onClick={()=>spAction('previous')}>
                        <SkipPreviousIcon />
                    </IconButton>

                    <IconButton aria-label="next" onClick={()=>spAction('next')}>
                         <SkipNextIcon />
                    </IconButton>
                    {loading ? <CircularProgress/> : <></>}
                    
                    </div>
                </div>
                

            </Card>
        )
    }
})
