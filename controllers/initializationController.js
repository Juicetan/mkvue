var fs = require('fs');
var fse = require('fs-extra');
var Deferred = require('../models/deferred');

var InitializationController = {
  setupProject: function(path){
    var def = new Deferred();

    fse.ensureDirSync(path);
    fse.copy(__dirname+'/../res/project',path).then(function(){
      console.log('> project created');
      def.resolve();
    });

    return def.promise;
  }
};

module.exports = InitializationController;