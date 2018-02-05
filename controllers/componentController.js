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
      fs.renameSync(path.resolve(newCompPath,'./_'+compLabel+'.scss'),path.resolve(newCompPath,'./_'+compName+'.scss'));
      fs.renameSync(path.resolve(newCompPath,'./'+compLabel+'.html'),path.resolve(newCompPath,'./'+compName+'.html'));
      fs.renameSync(path.resolve(newCompPath,'./'+compLabel+'.js'),path.resolve(newCompPath,'./'+compName+'.js'));

      def.resolve();
    });

    return def.promise;
  },
  replaceNames: function(compPath, defaultLabel,compName){
    var def = new Deferred();

    var className = StrUtil.camelize(compName.replaceAll('-',' '));
    className = className.charAt(0).toUpperCase()+className.substring(1);
    var generalRegex = new RegExp(defaultLabel,'gi');
    var jsTemplateRegex = new RegExp('#'+defaultLabel,'gi');
    var registrationRegex = new RegExp("'"+defaultLabel+"'",'g');
    var classRegex = new RegExp(defaultLabel.charAt(0).toUpperCase()+defaultLabel.slice(1),'g');

    Promise.settle([
      FileUtil.replace(path.resolve(compPath,'./_'+compName+'.scss'),generalRegex,compName),
      FileUtil.replace(path.resolve(compPath,'./'+compName+'.html'),generalRegex,compName),
      FileUtil.replace(path.resolve(compPath,'./'+compName+'.js'),jsTemplateRegex,'#'+compName)
    ]).then(function(){
      return FileUtil.replace(path.resolve(compPath,'./'+compName+'.js'),registrationRegex,"'"+compName+"'");
    }).then(function(){
      return FileUtil.replace(path.resolve(compPath,'./'+compName+'.js'),classRegex,className);
    }).then(function(){
      def.resolve();
    });

    return def.promise;
  },
  addComponentToDependency: function(file, importStr, delimStart, delimEnd){
    var extraction = StrUtil.extractBlock(file.data,delimStart,delimEnd);
    var components = extraction.block.split('\n');
    components = components.filter(function(line){
      return line && line !== '' && line !== '  ' && line !== '\n' && line !== '\r';
    });
    components = components.map(function(line){
      return line.replaceAll('\n','').replaceAll('\r','');
    });
    components.push(importStr);
    file.data = extraction.preBlock +
                delimStart + '\n' +
                components.join('\n') + '\n' +
                delimEnd +
                extraction.postBlock;
    file.saveData();
  },
  removeComponentFromDependency: function(file,compName, delimStart, delimEnd){
    var extraction = StrUtil.extractBlock(file.data,delimStart,delimEnd);
    var components = extraction.block.split('\n');
    components = components.filter(function(line){
      return line && line !== '' && line !== '  ' && line !== '\n' && line !== '\r' && line.indexOf(compName) < 0;
    });
    components = components.map(function(line){
      return line.replaceAll('\n','').replaceAll('\r','');
    });
    file.data = extraction.preBlock +
                delimStart + '\n' +
                components.join('\n') + '\n' +
                delimEnd +
                extraction.postBlock;
    file.saveData();
  },
  addComponentToStyles: function(workingPath, compName){
    var styleFile = new File(path.resolve(workingPath,Cfg.path.ROOTSTYLE));
    var importStr = "@import '../../components/"+compName+"/_"+compName+".scss';";
    this.addComponentToDependency(styleFile, importStr, Cfg.style.COMPSTART, Cfg.style.COMPEND);
  },
  removeComponentFromStyles: function(workingPath, compName){
    var styleFile = new File(path.resolve(workingPath,Cfg.path.ROOTSTYLE));
    this.removeComponentFromDependency(styleFile, compName, Cfg.style.COMPSTART, Cfg.style.COMPEND);
  },
  addComponentToScripts: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    var importStr = "  <script src='app/components/"+compName+"/"+compName+".js' type='text/javascript'></script>";
    this.addComponentToDependency(indexFile, importStr, Cfg.script.COMPSTART, Cfg.script.COMPEND);
  },
  removeComponentFromScripts: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    this.removeComponentFromDependency(indexFile, compName, Cfg.script.COMPSTART, Cfg.script.COMPEND);
  },
  addComponentToTemplates: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    var importStr = "  @@include('./templates/components/"+compName+"/"+compName+".html')";
    this.addComponentToDependency(indexFile, importStr, Cfg.template.COMPSTART, Cfg.template.COMPEND);
  },
  removeComponentFromTemplates: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROOTINDEX));
    this.removeComponentFromDependency(indexFile, compName, Cfg.template.COMPSTART, Cfg.template.COMPEND);
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
  createComp: function(workingPath, compName){
    var con = this;
    compName = FileUtil.resolveComponentName(compName);
    var newCompPath = path.resolve(workingPath,Cfg.path.COMPONENT+"/"+compName);

    this.createFiles(TEMPLATEPATH, newCompPath, 'component', compName).then(function(){
      return con.replaceNames(newCompPath, 'component', compName);
    }).then(function(){
      console.log('> component files created');
      return con.addDependencies(workingPath,compName);
    }).then(function(){
      console.log('> added component dependency');
    }).catch(function(e){
      console.log('> oh no',e);
    });
  },
  removeComp: function(workingPath, compName){
    compName = FileUtil.resolveComponentName(compName);
    var folderPath = path.resolve(Cfg.path.COMPONENT,'./'+compName);
    fse.emptyDirSync(folderPath);
    fs.rmdirSync(folderPath);

    this.removeDependencies(workingPath, compName);
    console.log('> removed component dependency');
  }
};

module.exports = ComponentController;