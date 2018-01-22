var fs = require('fs');
var fse = require('fs-extra');
var Deferred = require('../models/deferred');

var fsUtil = require('../utils/file');

var InitializationController = {
  replaceProjectName: function(path,projectName){
    console.log('> setting project name',projectName);
    return Promise.settle([
      fsUtil.replace(path+'/index.html','<!-- title -->',projectName),
      fsUtil.replace(path+'/package.json','<!-- title -->',projectName.toLowerCase().split(' ').join(''))
    ]);
  },
  setupProject: function(path){
    var def = new Deferred();
    var con = this;
    var folderName = path.substring(path.lastIndexOf("/")+1) || 'Vue Project';

    fse.ensureDirSync(path);
    fse.copy(__dirname+'/../res/project',path).then(function(){
      console.log('> project template created',path);
      return con.replaceProjectName(path,folderName);
    }).then(function(){
      console.log('> project template initialized');
    });

    return def.promise;
  }
};

module.exports = InitializationController;