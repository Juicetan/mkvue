var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var Cfg = require('../config/cfg');
var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');
var CompCon = require('./componentController');
var File = require('../models/file');

var TEMPLATEPATH = path.resolve(__dirname,'../res/route');

var RouteController = {
  addComponentToStyles: function(workingPath, compName){
    var styleFile = new File(path.resolve(workingPath,Cfg.path.ROOTSTYLE));
    var importStr = "@import '../../routes/"+compName+"/_"+compName+".scss';";
    CompCon.addComponentToDependency(styleFile, importStr, Cfg.style.ROUTESTART, Cfg.style.ROUTEEND);
  },
  removeComponentFromStyles: function(workingPath, compName){
    var styleFile = new File(path.resolve(workingPath,Cfg.path.ROOTSTYLE));
    CompCon.removeComponentFromDependency(styleFile, compName, Cfg.style.ROUTESTART, Cfg.style.ROUTEEND);
  },
  addComponentToScripts: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    var importStr = "  <script src='app/routes/"+compName+"/"+compName+".js' type='text/javascript'></script>";
    CompCon.addComponentToDependency(indexFile, importStr, Cfg.script.ROUTESTART, Cfg.script.ROUTEEND);
  },
  removeComponentFromScripts: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    CompCon.removeComponentFromDependency(indexFile, compName, Cfg.script.ROUTESTART, Cfg.script.ROUTEEND);
  },
  addComponentToTemplates: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    var importStr = "  @@include('./templates/routes/"+compName+"/"+compName+".html')";
    CompCon.addComponentToDependency(indexFile, importStr, Cfg.template.ROUTESTART, Cfg.template.ROUTEEND);
  },
  removeComponentFromTemplates: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    CompCon.removeComponentFromDependency(indexFile, compName, Cfg.template.ROUTESTART, Cfg.template.ROUTEEND);
  },
  addDependencies: function(workingPath, compName){
    this.addComponentToStyles(workingPath, compName);
    this.addComponentToScripts(workingPath, compName);
    this.addComponentToTemplates(workingPath, compName);
  },
  removeDependencies: function(workingPath, compName){
    this.removeComponentFromStyles(workingPath, compName);
    this.removeComponentFromScripts(workingPath, compName);
    this.removeComponentFromTemplates(workingPath, compName);
  },
  createRoute: function(workingPath, compName){
    var con = this;
    compName = FileUtil.resolveComponentName(compName);
    var newCompPath = path.resolve(workingPath,Cfg.path.ROUTE+"/"+compName);

    CompCon.createFiles(TEMPLATEPATH, newCompPath, 'route', compName).then(function(){
      return CompCon.replaceNames(newCompPath, 'route', compName);
    }).then(function(){
      console.log('> route files created');
      return con.addDependencies(workingPath, compName);
    }).then(function(){
      console.log('> added route dependency');
    }).catch(function(e){
      console.log('> oh no',e);
    });
  },
  removeRoute: function(workingPath, compName){
    compName = FileUtil.resolveComponentName(compName);
    var folderPath = path.resolve(Cfg.path.ROUTE,'./'+compName);
    fse.emptyDirSync(folderPath);
    fs.rmdirSync(folderPath);
    console.log('> removed route files');

    this.removeDependencies(workingPath, compName);
    console.log('> removed route dependency');
  }
};

module.exports = RouteController;