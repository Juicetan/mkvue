var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var Cfg = require('../config/cfg');
var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');
var File = require('../models/file');
var CompCon = require('./componentController');

var TEMPLATEPATH = path.resolve(__dirname,'../res/model');

var ModelController = {
  createFiles: function(templatePath, newCompPath, compLabel, compName){
    var def = new Deferred();

    fse.copy(templatePath, newCompPath).then(function(){
      fs.renameSync(path.resolve(newCompPath,'./'+compLabel+'.js'),path.resolve(newCompPath,'./'+compName+'.js'));

      def.resolve();
    });

    return def.promise;
  },
  addDependencies: function(workingPath, modelName){
    var indexFile = new File(path.resolve(workingPath, Cfg.path.ROOTINDEX));
    var importStr = "  <script src='app/models/"+modelName+".js' type='text/javascript'></script>";
    CompCon.addComponentToDependency(indexFile, importStr, Cfg.script.MODELSTART, Cfg.script.MODELEND);
  },
  removeDependencies: function(workingPath, modelName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    CompCon.removeComponentFromDependency(indexFile, modelName, Cfg.script.MODELSTART, Cfg.script.MODELEND);
  },
  createModel: function(workingPath, modelName){
    var con = this;
    modelName = FileUtil.resolveComponentName(modelName);
    var newModelPath = path.resolve(workingPath, Cfg.path.MODEL);

    con.createFiles(TEMPLATEPATH, newModelPath , 'model',modelName).then(function(){
      return CompCon.replaceNames(newModelPath, 'model', modelName);
    }).then(function(){
      console.log('> model file created');
      return con.addDependencies(workingPath, modelName);
    }).then(function(){
      console.log('> added model dependency');
    }).catch(function(e){
      console.log('> oh no', e);
    });
  },
  removeModel: function(workingPath, modelName){
    modelName = FileUtil.resolveComponentName(modelName);
    var filePath = path.resolve(Cfg.path.MODEL,'./'+modelName+".js");
    fs.unlinkSync(filePath)
    console.log('> removed model file');

    this.removeDependencies(workingPath, modelName);
    console.log('> removed model dependency');
  }
};

module.exports = ModelController;