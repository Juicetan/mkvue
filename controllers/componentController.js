var Deferred = require('../models/deferred');
var fse = require('fs-extra');

var ComponentController = {
  createFiles: function(path, compName){    
    var def = new Deferred();

    

    return def.promise;
  },
  addDependencies: function(){

  },
  createComp: function(path, compName){
    console.log(path,compName);
  }
};

module.exports = ComponentController;