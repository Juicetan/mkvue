var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var StrUtil = require('../utils/string');

var TEMPLATEPATH = path.resolve(__dirname,'../res/component');
var COMPONENTPATH = './app/components';

var ComponentController = {
  resolveComponentName: function(str){
    return str.replaceAll(' ','-')
              .replaceAll('.','')
              .replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },
  createFiles: function(projectPath, compName){    
    var def = new Deferred();
    var newCompPath = path.resolve(projectPath,COMPONENTPATH+"/"+compName);

    fse.copy(TEMPLATEPATH, newCompPath).then(function(){
      fs.renameSync(path.resolve(newCompPath,'./_component.scss'),path.resolve(newCompPath,'./_'+compName+'.scss'));
      fs.renameSync(path.resolve(newCompPath,'./component.html'),path.resolve(newCompPath,'./'+compName+'.html'));
      fs.renameSync(path.resolve(newCompPath,'./component.js'),path.resolve(newCompPath,'./'+compName+'.js'));

      def.resolve();
    });

    return def.promise;
  },
  addDependencies: function(){

  },
  createComp: function(path, compName){
    compName = this.resolveComponentName(compName);
    this.createFiles(path,compName).then(function(){
      console.log('> component files created')
    });
  },
};

module.exports = ComponentController;