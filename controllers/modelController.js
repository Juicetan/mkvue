var Deferred = require('../models/deferred');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

var StrUtil = require('../utils/string');
var FileUtil = require('../utils/file');

var TEMPLATEPATH = path.resolve(__dirname,'../res/model');
var MODELPATH = './app/models';

var ModelController = {
  createFiles: function(projectPath, compName){    
    var def = new Deferred();
    var newCompPath = path.resolve(projectPath,MODELPATH+"/");

    fse.copy(TEMPLATEPATH, newCompPath).then(function(){
      fs.renameSync(path.resolve(newCompPath,'./model.js'),path.resolve(newCompPath,'./'+compName+'.js'));

      def.resolve();
    });

    return def.promise;
  },
  addDependencies: function(){

  },
  createModel: function(path, modelName){
    modelName = FileUtil.resolveComponentName(modelName);
    this.createFiles(path,modelName).then(function(){
      console.log('> model files created')
    });
  }
};

module.exports = ModelController;