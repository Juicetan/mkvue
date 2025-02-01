import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs-extra';
import Deferred from '../models/deferred.mjs';


import fsUtil from '../utils/file.mjs';

export default {
  replaceProjectName: function(path,projectName){
    console.log('> setting project name',projectName);
    return Promise.settle([
      fsUtil.replace(path+'/index.html','<!-- title -->',projectName),
      fsUtil.replace(path+'/package.json','<!-- title -->',projectName),
      fsUtil.replace(path+'/public/manifest.json','<!-- title -->',projectName)
    ]);
  },
  setupProject: function(path){
    var def = new Deferred();
    var con = this;
    var folderName = path.substring(path.lastIndexOf("/")+1);
    if(folderName === '.'){
      folderName = 'VueProject-'+Math.round(Date.now()/1000);
    }

    var cleansedFolderName = folderName.replaceAll(' ','-');
    path = path.replace(folderName,cleansedFolderName);
    folderName = cleansedFolderName;

    fs.ensureDirSync(path);
    fs.copy(__dirname+'/../res/project',path).then(function(){
      console.log('> project template created',path);
      return con.replaceProjectName(path,folderName);
    }).then(function(){
      console.log('> project template initialized');
    });

    return def.promise;
  }
};