const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const graph = require('fbgraph');
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
    app.get('/', function(req, res) {
        res.render('index', {
            urls: [
                {
                    url: '/FBLoginTest',
                    label: 'login test'
                },
                {
                    url: '/FBPostTest',
                    label: 'post test'
                },
                {
                    url: '/FBUploadVideoTest',
                    label: 'upload video test'
                }
            ]
        });
    });

    app.get('/FBLoginTest', function(req, res) {
        res.render('loginExample', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version,
            "fb_api_scope": fbConfig.scope
        });
    });

    app.get('/FBPostTest', function(req, res) {
        res.render('uploadTest', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version,
            "fb_api_scope": fbConfig.scope,
            "action_btn_label": "貼文測試",
        });
    });

    app.get('/FBUploadVideoTest', function(req, res) {
        res.render('uploadTest', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version,
            "fb_api_scope": fbConfig.scope,
            "action_btn_label": "分享影片",
        });
    });

    app.post('/postToWall', bodyParser.json(), function(req, res) {
        if(req.body) {
            //req.body should be a json with following structure:
             /*
                authResponse: {
                    accessToken: '...',
                    expiresIn:'...',
                    signedRequest:'...',
                    userID:'...'
                }
                如果狀態是 connected，就會包含 authResponse，且由以下資料所構成：
                accessToken - 含有這位應用程式用戶的存取權杖。
                expiresIn - 以 UNIX 時間顯示權杖何時到期並需要再次更新。
                signedRequest - 已簽署的參數，其中包含這位應用程式用戶的資訊。
                userID - 這位應用程式用戶的編號。
            */

            graph.setAccessToken(req.body.accessToken);
            var wallPost = {
                message: 'an post test from my node server via graph api'
            };

            graph.post("/feed", wallPost, function(err, fbRes) {
                if(err)  
                    res.status(400).send(err);
                else {    
                    // returns the post id
                    console.log("post succeed, post id:" + fbRes.id); // { id: xxxxx}
                    res.status(200).end();
                }
            });

        }
        else {
            var errorMsg = 'no json data for uploadVideo route';
            console.log();
            res.status(400).send(errorMsg);
        }
    });

    app.post('/uploadVideo', bodyParser.json(), function(req, res) {
        if(req.body) {
            console.log(req.body);
            //req.body should be a json with following structure:
             /*
                authResponse: {
                    accessToken: '...',
                    expiresIn:'...',
                    signedRequest:'...',
                    userID:'...'
                }
                如果狀態是 connected，就會包含 authResponse，且由以下資料所構成：
                accessToken - 含有這位應用程式用戶的存取權杖。
                expiresIn - 以 UNIX 時間顯示權杖何時到期並需要再次更新。
                signedRequest - 已簽署的參數，其中包含這位應用程式用戶的資訊。
                userID - 這位應用程式用戶的編號。
            */
            graph.setAccessToken(req.body.accessToken);
            

            res.status(200).end();
        }
        else {
            var errorMsg = 'no json data for uploadVideo route';
            console.log();
            res.status(400).send(errorMsg);
        }
        
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

