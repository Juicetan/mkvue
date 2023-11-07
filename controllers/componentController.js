var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var Cfg = require('../config/cfg');
var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');
var File = require('../models/file');

var TEMPLATEPATH = path.resolve(__dirname,'../res/component');

var ComponentController = {
  createFiles: function(templatePath, newCompPath, compLabel, compName){
    var def = new Deferred();

    fse.copy(templatePath, newCompPath).then(function(){
      fs.renameSync(path.resolve(newCompPath,'./'+compLabel+'.vue'),path.resolve(newCompPath,'./'+compName+'.vue'));

      def.resolve();
    });

    return def.promise;
  },
  replaceNames: function(compPath, defaultLabel,compName){
    var def = new Deferred();

    var generalRegex = new RegExp(defaultLabel,'gi');
    var dasherizedCompName = StrUtil.dasherize(compName);

    FileUtil.replace(path.resolve(compPath,'./'+compName+'.vue'),generalRegex,dasherizedCompName).then(function(){
      def.resolve();
    }).catch(function(e){
      def.reject(e);
    });

    return def.promise;
  },
  createComp: function(workingPath, compName){
    var con = this;
    compName = StrUtil.pascalize(compName);
    var newCompPath = path.resolve(workingPath,Cfg.path.COMPONENT);

    this.createFiles(TEMPLATEPATH, newCompPath, 'Component', compName).then(function(){
      return con.replaceNames(newCompPath, 'Component', compName);
    }).then(function(){
      console.log('> component files created');
    }).catch(function(e){
      console.log('> oh no',e);
    });
  },
  removeComp: function(workingPath, compName){
    compName = StrUtil.pascalize(compName);
    var filePath = path.resolve(Cfg.path.COMPONENT,'./'+compName+'.vue');
    fs.unlinkSync(filePath)
    console.log('> removed component file');
  }
};

module.exports = ComponentController;