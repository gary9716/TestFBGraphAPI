module.exports = function() {
    console.log('start to gen');
    const fs = require('fs');
    //this file must not be commited to version control system. gitignore in this folder has been set to ignore this file
    var targetFileName = 'fbConfig.js'; 

    fs.copyFile('fbConfigTemplate.js', targetFileName, function(err) {
        if(err) throw err;
        var prependFile = require('prepend-file');
        var warningMsg = "//this file must not be commited to version control system. gitignore in this folder has been set to ignore this file\n";
        prependFile(targetFileName, warningMsg, function (err) {
            if (err) throw err;
        });
    });
}
