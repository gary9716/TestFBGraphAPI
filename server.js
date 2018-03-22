const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

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

    app.use('/public', express.static(__dirname + '/public'));

    //use DoT as server-side rendering engine
    var engine = require('express-dot-engine');
    app.engine('dot', engine.__express);
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'dot');

    app.get('/FBLoginTest', function(req, res) {
        res.render('loginExample', { 
            "app_id": fbConfig.app_id, 
            "api_version": fbConfig.api_version
        });
    });

    app.listen(3000, () => console.log('server is listening on port 3000!'));
}

