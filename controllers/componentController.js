var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');

var TEMPLATEPATH = path.resolve(__dirname,'../res/component');
var COMPONENTPATH = './app/components';

var ComponentController = {
  createFiles: function(newCompPath, compName){    
    var def = new Deferred();

    fse.copy(TEMPLATEPATH, newCompPath).then(function(){
      fs.renameSync(path.resolve(newCompPath,'./_component.scss'),path.resolve(newCompPath,'./_'+compName+'.scss'));
      fs.renameSync(path.resolve(newCompPath,'./component.html'),path.resolve(newCompPath,'./'+compName+'.html'));
      fs.renameSync(path.resolve(newCompPath,'./component.js'),path.resolve(newCompPath,'./'+compName+'.js'));

      def.resolve();
    });

    return def.promise;
  },
  replaceNames: function(compPath, compName){
    var def = new Deferred();

    var className = StrUtil.camelize(compName.replaceAll('-',' '));
    className = className.charAt(0).toUpperCase()+className.substring(1);

    Promise.settle([
      FileUtil.replace(path.resolve(compPath,'./_'+compName+'.scss'),/component/g,compName),
      FileUtil.replace(path.resolve(compPath,'./'+compName+'.html'),/component/g,compName),
      FileUtil.replace(path.resolve(compPath,'./'+compName+'.js'),/component/g,compName)      
    ]).then(function(){
      return FileUtil.replace(path.resolve(compPath,'./'+compName+'.js'),/Component/g,className);
    }).then(function(){
      def.resolve();
    });

    return def.promise;
  },
  addDependencies: function(){

  },
  createComp: function(workingPath, compName){
    var con = this;
    compName = FileUtil.resolveComponentName(compName);
    var newCompPath = path.resolve(workingPath,COMPONENTPATH+"/"+compName);

    this.createFiles(newCompPath,compName).then(function(){
      console.log('> component files created');
      return con.replaceNames(newCompPath,compName);
    });
  }
};

module.exports = ComponentController;