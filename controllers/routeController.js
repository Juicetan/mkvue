var fs = require('fs');
var path = require('path');

var Cfg = require('../config/cfg');
var StrUtil = require('../utils/string');
var CompCon = require('./componentController');

var TEMPLATEPATH = path.resolve(__dirname,'../res/route');

var RouteController = {
  addToRouteIndex: function(compName){
    
  },
  removeFromRouteIndex: function(compName){

  },
  createRoute: function(workingPath, compName){
    var con = this;
    compName = StrUtil.pascalize(compName);
    var newCompPath = path.resolve(workingPath,Cfg.path.ROUTE);

    CompCon.createFiles(TEMPLATEPATH, newCompPath, 'RouteView', compName).then(function(){
      return CompCon.replaceNames(newCompPath, 'RouteView', compName);
    }).then(function(){
      console.log('> route files created');
    }).catch(function(e){
      console.log('> oh no',e);
    });
  },
  removeRoute: function(workingPath, compName){
    compName = StrUtil.pascalize(compName);
    var filePath = path.resolve(Cfg.path.ROUTE,'./'+compName+'.vue');
    fs.unlinkSync(filePath)
    console.log('> removed route file');
  }
};

module.exports = RouteController;