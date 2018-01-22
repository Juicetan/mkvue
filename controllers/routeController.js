var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');

var TEMPLATEPATH = path.resolve(__dirname,'../res/route');
var ROUTEPATH = './app/routes';

var RouteController = {
  createFiles: function(projectPath, compName){    
    var def = new Deferred();
    var newCompPath = path.resolve(projectPath,ROUTEPATH+"/"+compName);

    fse.copy(TEMPLATEPATH, newCompPath).then(function(){
      fs.renameSync(path.resolve(newCompPath,'./_route.scss'),path.resolve(newCompPath,'./_'+compName+'.scss'));
      fs.renameSync(path.resolve(newCompPath,'./route.html'),path.resolve(newCompPath,'./'+compName+'.html'));
      fs.renameSync(path.resolve(newCompPath,'./route.js'),path.resolve(newCompPath,'./'+compName+'.js'));

      def.resolve();
    });

    return def.promise;
  },
  addDependencies: function(){

  },
  createRoute: function(path, compName){
    compName = FileUtil.resolveComponentName(compName);
    this.createFiles(path,compName).then(function(){
      console.log('> route files created')
    });
  }
};

module.exports = RouteController;