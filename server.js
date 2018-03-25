const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const graph = require('fbgraph');
const FB = require('fb');

const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

if(!fs.existsSync('./fbConfig.js')) {
    const configGenerate = require('./fbConfigGenerator');
    configGenerate();
    console.log("please setup the config file(fbConfig.js) before running the server");
    return;
}
else {
    setupServer();
}

function setupServer() {
    const fbConfig = require('./fbConfig');

    //setup middleware
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

    FB.options({version: fbConfig.api_version});

    //routes-----

    //view rendering routes
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
            "target_route": "/postToWall"
        });
    });

    app.get('/FBUploadVideoTest', function(req, res) {
        res.render('uploadTest', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version,
            "fb_api_scope": fbConfig.scope,
            "action_btn_label": "分享影片",
            "target_route": "/uploadVideo"
        });
    });

    //action routes
    /*
        下面名為authResponse的變數皆符合以下格式
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
   
    app.post('/postToWall', bodyParser.json(), function(req, res) {
        var baseMsg = 'a message posted from my node server via graph api and ';
        var wallPostList = [
            { //0
                message: baseMsg + ' only I can see it',
                privacy: {
                    value: 'SELF'
                }
            },
            { //1
                message: baseMsg + ' only my friends can see it',
                privacy: {
                    value: 'ALL_FRIENDS'
                }
            },
            { //2
                message: baseMsg + ' only my friends and friends of friends can see it',
                privacy: {
                    value: 'FRIENDS_OF_FRIENDS' //this also didn't work
                }
            },
            { //3
                message: baseMsg + ' everyone can see it',
                privacy: {
                    value: 'EVERYONE' //this didn't work. maybe it's somehow related to user setting
                }
            }
        ];

        //method definitions-----
        //for more details about the parameters of feed posting, please refer to: https://developers.facebook.com/docs/graph-api/reference/v2.12/user/feed#publish
        var doFeedPostTest1 = function(authResponse) {
            //via this SDK: https://github.com/node-facebook/facebook-node-sdk

            FB.setAccessToken(authResponse.accessToken);
            FB.api("me/feed","post", wallPostList[0],function (fbRes) {
                if(!fbRes || fbRes.error) {
                    var errorMsg = !fbRes ? 'error occurred' : fbRes.error;
                    console.log(errorMsg);
                    res.status(400).send(errorMsg);
                    return;
                }
                else {
                    console.log('Feed Post Id: ' + fbRes.id);
                    res.status(200).end();
                }

            });

        }

        var doFeedPostTest2 = function(authResponse) {
            //via this SDK: https://github.com/criso/fbgraph

            graph.setAccessToken(authResponse.accessToken);
            graph.post("me/feed", wallPostList[0], function(err, fbRes) {
                if(err)  
                    res.status(400).send(err);
                else {    
                    // returns the post id
                    console.log("feed post succeed, post id:" + fbRes.id); // { id: xxxxx}
                    res.status(200).end();
                }
            });

        }
        //method definitions-----

        if(req.body) {
            doFeedPostTest2(req.body);
        }
        else {
            var errorMsg = 'no json data for uploadVideo route';
            console.log();
            res.status(400).send(errorMsg);
        }
    });


    app.post('/uploadVideo', bodyParser.json(), function(req, res) {
        //method definitions-----
        var doVideoUploadTest1 = function(authResponse) {
            //via this SDK: https://github.com/node-facebook/facebook-node-sdk

            FB.setAccessToken(authResponse.accessToken);
            var videoData = {
                source: fs.createReadStream(__dirname + '/videos/testVideo.mov'),
                description: 'a test video for testing video uploading',
                title: 'My Test Video',
                privacy: {
                    value: 'SELF' //this value can be one of {'EVERYONE', 'ALL_FRIENDS', 'FRIENDS_OF_FRIENDS', 'CUSTOM', 'SELF'}. For more details, please refer to https://developers.facebook.com/docs/graph-api/common-scenarios#privacy-param
                },
                is_explicit_share: true
            };

            //for more details about video publishing(such as parameters), please refer to https://developers.facebook.com/docs/graph-api/reference/video/
            FB.api("me/videos","post", videoData, function (fbRes) {
                if(!fbRes || fbRes.error) {
                    var errorMsg = !fbRes ? 'error occurred' : fbRes.error;
                    console.log(errorMsg);
                    res.status(400).send(errorMsg);
                    return;
                }
                else {
                    console.log('Video Post Id: ' + fbRes.id);
                    res.status(200).end();
                }
            });
        }
        //method definitions-----

        if(req.body) {
            doVideoUploadTest1(req.body);
        }
        else {
            var errorMsg = 'no json data for uploadVideo route';
            console.log();
            res.status(400).send(errorMsg);
        }
        
    });
 
    app.listen(3000, () => console.log('server is listening on port 3000!'));
}

