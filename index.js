//modules
const 
    express = require('express'),
    app = express(),
    glob = require('glob'),
    exceptions = require('./utils/exceptions'),
    path = require('path');

// variables
const 
    port = process.env.PORT || 3000,
    endpointsPrefix = '_endpoint.js';


app.use(express.json()) ;
app.use(require('morgan')('dev')) ;

//add global parameters
app.param('startupId', (req, res, next, startupId) => {
    req.startupId = startupId;
    next()
});

app.param('stageId', (req, res, next, stageId) => {
    req.stageId = stageId;
    next()
});


//add routes
glob.sync( `./endpoints/*${endpointsPrefix}` ).forEach( function( file ) {
        console.log('Adding API Rest endpoint for: '+path.basename( file ))
        let endpoint = require(path.resolve( file )) ;
        app.use(endpoint.baseUrl, endpoint.router) ;
    });



app.listen(port, ()=>{
    console.log('Server started on port: ' +port+ ' for OAK\'S assignment - Startup Progress');
})


