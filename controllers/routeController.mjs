import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Cfg from '../config/cfg.mjs';
import StrUtil from '../utils/string.mjs';
import File from '../models/file.mjs';
import CompCon from './componentController.mjs';

const TEMPLATEPATH = path.resolve(__dirname,'../res/route');
const NEWLINEREGEX = /\r?\n/;

var RouteController = {
  addToRouteIndex: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROUTER));
    
    // imports
    var importExtract = StrUtil.extractBlock(indexFile.data, Cfg.delimsRegex.ROUTESIMPORTSTART,Cfg.delimsRegex.ROUTESIMPORTEND);
    var importStrs = importExtract.block.split(NEWLINEREGEX).filter(function(val){
      return val && typeof val === 'string' && val.trim();
    });
    importStrs.push(`import ${compName} from '../views/${compName}.vue';`);

    indexFile.data = importExtract.preBlock +
                     Cfg.delims.ROUTESIMPORTSTART + '\n' +
                     importStrs.join('\n') + '\n' + 
                     Cfg.delims.ROUTESIMPORTEND + '\n' +
                     importExtract.postBlock;

    // router registration
    var regExtract = StrUtil.extractBlock(indexFile.data, Cfg.delimsRegex.ROUTESSTART, Cfg.delimsRegex.ROUTESEND);
    var regStrs = regExtract.block.split(NEWLINEREGEX).filter(function(val){
      return val && typeof val === 'string' && val.trim();
    });
    regStrs.push(`    {
      path: '/${StrUtil.camelize(compName)}',
      name: '${StrUtil.camelize(compName)}',
      component: ${compName},
      meta: {
        transition: 'fade'
      }
    },`);

    indexFile.data = regExtract.preBlock +
                     Cfg.delims.ROUTESSTART + '\n' +
                     regStrs.join('\n') + '\n' + 
                     '    ' + Cfg.delims.ROUTESEND + '\n' +
                     regExtract.postBlock;
    indexFile.saveData();
  },
  removeFromRouteIndex: function(workingPath, compName){
    var indexFile = new File(path.resolve(workingPath,Cfg.path.ROUTER));

    // imports
    var importExtract = StrUtil.extractBlock(indexFile.data, Cfg.delimsRegex.ROUTESIMPORTSTART,Cfg.delimsRegex.ROUTESIMPORTEND);
    var importStrs = importExtract.block.split(NEWLINEREGEX).filter(function(val){
      return val && typeof val === 'string' && val.trim();
    }).filter(function(val){
      return !val.includes(compName);
    });
    indexFile.data = importExtract.preBlock +
                     Cfg.delims.ROUTESIMPORTSTART + '\n' +
                     importStrs.join('\n') + (importStrs.length?'\n':'') + 
                     Cfg.delims.ROUTESIMPORTEND + '\n' +
                     importExtract.postBlock;
    
    // router unregistration
    var regExtract = StrUtil.extractBlock(indexFile.data, Cfg.delimsRegex.ROUTESSTART, Cfg.delimsRegex.ROUTESEND);
    var regStrs = regExtract.block.split(/},\r?\n/).filter(function(val){
      return val && typeof val === 'string' && val.trim();
    }).filter(function(val){
      return !val.includes(compName);
    });
    indexFile.data = regExtract.preBlock +
                     Cfg.delims.ROUTESSTART + '\n' +
                     regStrs.join('},\n') + (regStrs.length?'},\n':'') + 
                     '    ' + Cfg.delims.ROUTESEND +  '\n' +
                     regExtract.postBlock;
    indexFile.saveData();
  },
  createRoute: function(workingPath, compName){
    var con = this;
    compName = StrUtil.pascalize(compName);
    var newCompPath = path.resolve(workingPath,Cfg.path.ROUTE);

    CompCon.createFiles(TEMPLATEPATH, newCompPath, 'RouteView', compName).then(function(){
      return CompCon.replaceNames(newCompPath, 'RouteView', compName);
    }).then(function(){
      console.log('> route files created');
      return con.addToRouteIndex(workingPath, compName);
    }).then(function(){
      console.log('> route registered');
    }).catch(function(e){
      console.log('> oh no',e);
    });
  },
  removeRoute: function(workingPath, compName){
    compName = StrUtil.pascalize(compName);
    var filePath = path.resolve(Cfg.path.ROUTE,'./'+compName+'.vue');
    fs.unlinkSync(filePath)
    console.log('> removed route file');
    this.removeFromRouteIndex(workingPath, compName);
    console.log('> route unregistered');
  }
};

export default RouteController;