import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
export default function About() {
    return (
        <div>
            <Typography gutterBottom>
            <strong>SpoGen</strong> was created by <Link href="//kddlb.cl" color="secondary">Kevin López B.</Link> Uses the <Link href="//developer.spotify.com"  color="secondary">Spotify</Link> and <Link href="//docs.genius.com"  color="secondary">Genius</Link> APIs. Not for profit.
            </Typography>
            <Typography gutterBottom>Contact me through <Link href="//kode54.net/contact"  color="secondary">kode54's contact form</Link>.</Typography>
            <Typography>SpoGen is &copy; 2019-2020 by Kevin López Brante. All content copyrights are acknowledged.</Typography>
        </div>
            )
        }
