const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const graph = require('fbgraph');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const redirect_uri = "https://localhost:8080/auth";

if(!fs.existsSync('./fbConfig.js')) {
    const configGenerate = require('./fbConfigGenerator');
    configGenerate();
    console.log("please setup the config file(fbConfig.js) before running the server");
    return;
}
else {
    setupServer();
}


//setup middlewares
app.use('/public', express.static(__dirname + '/public'));

//use DoT as server-side rendering engine
var engine = require('express-dot-engine');
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dot');
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}


function setupServer() {
    const fbConfig = require('./fbConfig');

    //routes
    app.get('/FBLoginTest', function(req, res) {
        res.render('loginExample', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version,
            "fb_api_scope": fbConfig.scope
        });
    });

    app.get('/FBUploadTest', function(req, res) {
        res.render('uploadTest', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version,
            "fb_api_scope": fbConfig.scope
        });
    });

    app.post('/uploadVideo', bodyParser.json(), function(req, res) {
        if(req.body) {
            console.log(req.body);
        }
        else {
            console.log('no json data for uploadVideo route');
        }
        res.status(200).end();
    });

    /*
    app.get('/auth', function(req, res) {

        // we don't have a code yet
        // so we'll redirect to the oauth dialog
        if (!req.query.code) {
            console.log("Performing oauth for some user right now.");
        
            var authUrl = graph.getOauthUrl({
                "client_id":     fbConfig.app_id
                , "redirect_uri":  redirect_uri
                , "scope":         fbConfig.scope
            });
        
            if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
                res.redirect(authUrl);
            } else {  //req.query.error == 'access_denied'
                console.log("auth failed:" + req.query.error);
                res.send('access denied');
            }

        }
        // If this branch executes user is already being redirected back with 
        // code (whatever that is)
        else {
            // code is set
            // we'll send that and get the access token
            graph.authorize({
                "client_id":      fbConfig.app_id
                , "redirect_uri":   redirect_uri
                , "client_secret":  fbConfig.secret
                , "code":           req.query.code
            }, function (err, facebookRes) {
                console.log("authorized:");
                console.log(facebookRes);
                res.redirect('/UserHasLoggedIn');
            });
        }
    });
    
    
    // user gets sent here after being authorized
    app.get('/UserHasLoggedIn', function(req, res) {
        res.render("index", { 
            title: "Logged In" 
        });
    });
    */

    app.listen(3000, () => console.log('server is listening on port 3000!'));
}

