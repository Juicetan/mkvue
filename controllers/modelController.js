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
  replaceNames: function(compPath, defaultLabel,compName){
    var def = new Deferred();

    var className = StrUtil.pascalize(compName);
    var classRegex = new RegExp(StrUtil.pascalize(defaultLabel),'g');

    FileUtil.replace(path.resolve(compPath,'./'+compName+'.js'),classRegex,className).then(function(){
      def.resolve();
    }).catch(function(e){
      def.reject(e);
    });

    return def.promise;
  },
  createModel: function(workingPath, modelName){
    var con = this;
    modelName = FileUtil.resolveComponentName(modelName);
    var newModelPath = path.resolve(workingPath, Cfg.path.MODEL);

    con.createFiles(TEMPLATEPATH, newModelPath , 'model',modelName).then(function(){
      return con.replaceNames(newModelPath, 'model', modelName);
    }).then(function(){
      console.log('> model file created');
    }).catch(function(e){
      console.log('> oh no', e);
    });
  },
  removeModel: function(workingPath, modelName){
    modelName = FileUtil.resolveComponentName(modelName);
    var filePath = path.resolve(Cfg.path.MODEL,'./'+modelName+".js");
    fs.unlinkSync(filePath)
    console.log('> removed model file');
  }
};

module.exports = ModelController;