import Deferred from '../models/deferred.mjs';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Cfg from '../config/cfg.mjs';
import StrUtil from '../utils/string.mjs';
import FileUtil from '../utils/file.mjs';

var TEMPLATEPATH = path.resolve(__dirname,'../res/component');

export default {
  createFiles: function(templatePath, newCompPath, compLabel, compName){
    var def = new Deferred();

    fs.copy(templatePath, newCompPath).then(function(){
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