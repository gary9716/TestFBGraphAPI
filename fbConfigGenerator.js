module.exports = function() {
    const fs = require('fs');
    //this file must not be commited to version control system. gitignore in this folder has been set to ignore this file
    var targetFileName = 'fbConfig.js'; 
    var rstream = fs.createReadStream('fbConfigTemplate.js');
    var wstream = fs.createWriteStream(targetFileName);
    var warningMsg = "//this file must not be commited to version control system. gitignore in this folder has been set to ignore this file\n";
    wstream.write(warningMsg);
    rstream.pipe(wstream);
}
