import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import { makeStyles } from '@material-ui/core/styles'

import { withSnackbar } from 'notistack'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles(theme => ({
    sticky: {
        position: "sticky",
        top: "65px"
    }
}));


export default withSnackbar(function ResultsList(props) {

    const [loading, setLoading] = useState(true)
    const [list, setList] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)

    const classes = useStyles();

    const fetchList = async () => {
        console.log(props.pInfo.item)
        // eslint-disable-next-line
        if (props.pInfo.item != null || props.pInfo.item != undefined) {
            setLoading(true)
            const result = (await axios.get("/api/genius/search", {
                params: {
                    artist: props.pInfo.item.artists[0].name,
                    track: props.pInfo.item.name
                }
            })).data
            setLoading(false)
            setList(result)
            setSelectedItem(result[0])
            props.load(result[0])

        }
    }

    useEffect(() => {
        fetchList()
    }, [props.pInfo])

    const handleListItemClick = (event, index) => {
        setSelectedItem(index)
        props.load(index)
    };



    if (props.pInfo.loading || loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" m={2}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    } else if (list.length === 0) {
        props.load("nl")
        return (<Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={true}
            autoHideDuration={6000}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Lyrics not found.</span>}
            
          />)
    } else {
        return (
            <Paper className={classes.sticky}>
                <List dense component="nav">
                    {list.map(x => (
                        <ListItem key={x.api_path} button selected={selectedItem === x} onClick={event => handleListItemClick(event, x)}>
                            <ListItemText primary={x.title_with_featured} secondary={x.primary_artist.name} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        )
    }
})
