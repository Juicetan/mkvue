var replace = require('replace-in-file');
var Deferred = require('../models/deferred');

var FileUtil = {
  replace: function(fileSelector,searchRegex,replaceStr){
    var def = new Deferred();
    
    replace({
      files: fileSelector,
      from: searchRegex,
      to: replaceStr
    }).then(function(filesChangedArr){
      def.resolve();
    }).catch(function(e){
      def.reject(e);
    });

    return def.promise;
  },
  resolveComponentName: function(str){
    return str.replaceAll(' ','-')
              .replaceAll('.','')
              .replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },
};


module.exports = FileUtil;