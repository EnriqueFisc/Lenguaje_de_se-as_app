const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();

const indexHtmlPath = path.join( __dirname, '../public/index.html' );

const PORT = process.env.PORT || '3000';

app.use( express.static( path.join( __dirname, '../public' ) ) );
app.use( express.json() );
app.use( cors({
    origin: 'https://s-install.avcdn.net',
    origin: 'http://localhost:3000/'
}));


app.get( '*', ( req, res ) => {
    res.sendFile( indexHtmlPath );
});


app.listen( PORT, () => {
    console.log( `Server encendido en puerto ${ PORT }` );
});