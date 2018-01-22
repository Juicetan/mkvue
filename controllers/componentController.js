var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');
var File = require('../models/file');

var TEMPLATEPATH = path.resolve(__dirname,'../res/component');
var ROOTINDEXPATH = './index.html';
var ROOTSTYLEPATH = './app/base/css/styles.scss';
var COMPONENTPATH = './app/components';
var STYLECOMPSTART = '/** components:start **/';
var STYLECOMPEND = '/** components:end **/';
var SCRIPTCOMPSTART = '<!-- components:script:start -->';
var SCRIPTCOMPEND = '<!-- components:script:end -->';
var TEMPLATECOMPSTART = '<!-- components:template:start -->';
var TEMPLATECOMPEND = '<!-- components:template:end -->';

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
  addComponentToStyles: function(workingPath, compName){
    var styleFile = new File(path.resolve(workingPath,ROOTSTYLEPATH));
    var extraction = StrUtil.extractBlock(styleFile.data,STYLECOMPSTART,STYLECOMPEND);
    var components = extraction.block.split('\n');
    components = components.filter(function(line){
      return line && line !== '' && line !== '  ' && line !== '\n';
    });
    components.push("@import '../../components/"+compName+"/_"+compName+".scss';\n");
    styleFile.data = extraction.preBlock + 
                     STYLECOMPSTART +
                     components.join('\n') +
                     STYLECOMPEND + 
                     extraction.postBlock;
    styleFile.saveData();
  },
  addComponentToScripts: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,ROOTINDEXPATH));
    var extraction = StrUtil.extractBlock(indexFile.data,SCRIPTCOMPSTART,SCRIPTCOMPEND);
    var components = extraction.block.split('\n');
    components = components.filter(function(line){
      return line && line !== '' && line !== '  ' && line !== '\n';
    });
    components.push("  <script src='app/components/"+compName+"/"+compName+".js' type='text/javascript'></script>\n");
    indexFile.data = extraction.preBlock + 
                     SCRIPTCOMPSTART +
                     components.join('\n') + '  ' +
                     SCRIPTCOMPEND + 
                     extraction.postBlock;
    indexFile.saveData();
  },
  addComponentToTemplates: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,ROOTINDEXPATH));
    var extraction = StrUtil.extractBlock(indexFile.data,TEMPLATECOMPSTART,TEMPLATECOMPEND);
    var components = extraction.block.split('\n');
    components = components.filter(function(line){
      return line && line !== '' && line !== '  ' && line !== '\n';
    });
    components.push("  @@include('app/components/"+compName+"/"+compName+".html')\n");
    indexFile.data = extraction.preBlock + 
                     TEMPLATECOMPSTART +
                     components.join('\n') + '  ' +
                     TEMPLATECOMPEND + 
                     extraction.postBlock;
    indexFile.saveData();
  },
  addDependencies: function(workingPath, compName){
    this.addComponentToStyles(workingPath, compName);
    this.addComponentToScripts(workingPath, compName);
    this.addComponentToTemplates(workingPath, compName);
  },
  createComp: function(workingPath, compName){
    var con = this;
    compName = FileUtil.resolveComponentName(compName);
    var newCompPath = path.resolve(workingPath,COMPONENTPATH+"/"+compName);

    this.createFiles(newCompPath,compName).then(function(){
      return con.replaceNames(newCompPath,compName);
    }).then(function(){
      console.log('> component files created');
      return con.addDependencies(workingPath,compName);
    }).then(function(){

    }).catch(function(e){
      console.log('> oh no',e);
    });
  }
};

module.exports = ComponentController;