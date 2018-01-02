var fs = require('fs');
var fse = require('fs-extra');
var Deferred = require('../models/deferred');
var fsUtil = require('../utils/file');

var InitializationController = {
  setupProject: function(path){
    var def = new Deferred();
    var folderName = path.substring(0,path.lastIndexOf("\\")+1);

    fse.ensureDirSync(path);
    fse.copy(__dirname+'/../res/project',path).then(function(){
      console.log('> project template created',path);

      return fsUtil.replace(path+'/index.html','<!-- title -->','Test Project');
    }).then(function(){
      console.log('> project template initialized');
    });

    return def.promise;
  }
};

module.exports = InitializationController;