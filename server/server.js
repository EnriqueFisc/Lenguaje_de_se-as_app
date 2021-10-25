const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();

const indexHtmlPath = path.join( __dirname, '../public/index.html' );

app.use( express.static( path.join( __dirname, '../public' ) ) );
app.use( express.json() );
// app.use( cors() );


app.get( '*', ( req, res ) => {
    res.sendFile( indexHtmlPath );
});


app.listen( '3000', () => {
    console.log( 'Server encendido en puerto 3000' );
});