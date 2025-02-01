import Deferred from '../models/deferred.mjs';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Cfg from '../config/cfg.mjs';
import StrUtil from '../utils/string.mjs';
import FileUtil from '../utils/file.mjs';

var TEMPLATEPATH = path.resolve(__dirname,'../res/model');

export default {
  createFiles: function(templatePath, newCompPath, compLabel, compName){
    var def = new Deferred();

    fs.copy(templatePath, newCompPath).then(function(){
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