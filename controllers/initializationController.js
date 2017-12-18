var fs = require('fs');
var fse = require('fs-extra');

var InitializationController = {
  setupProject: function(path){
    fse.ensureDirSync(path);
    fse.copy(__dirname+'/../res/project',path).then(function(){
      console.log('hrmmm');
    })
  }
};

module.exports = InitializationController;