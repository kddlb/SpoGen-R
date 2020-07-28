import React, { useEffect, useState } from 'react'
import axios from 'axios'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'


var HtmlToReactParser = require('html-to-react').Parser
var htmlToReactParser = new HtmlToReactParser()


export default function LyricsView(props) {

    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({ html: "", text: "" })


    const fetchLyrics = async () => {
        if (props.item != null || props.item != undefined) {
            setLoading(true)
            setContent({ html: "", text: "" })
            //const result = (await axios.get(`/api/genius/get${props.item.path}`)).data

            let page = (await axios.get(`https://cwp.losno.co/?${props.item.url}`)).data
            let result = (await axios.post("/api/genius/parse", {text: page})).data
            setLoading(false)
            setContent(result)
            props.loadLyrics(result.text)
        }
    }

    useEffect(() => {
        fetchLyrics()
    }, [props.item])

    if ((props.loading && content.html == "") || props.item == null) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" m={2}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    } else {
        return (
            <Paper>
                <Box p={2}>
                    <Typography variant="h6">Lyrics</Typography>
                </Box>
                <Box px={2} pb={2}>
                    {htmlToReactParser.parse(content.html)}
                </Box>
            </Paper>
        )
    }
}
