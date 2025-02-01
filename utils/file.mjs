import { replaceInFile } from 'replace-in-file';
import Deferred from '../models/deferred.mjs';

export default {
  replace: function(fileSelector, searchRegex, replaceStr){
    var def = new Deferred();
    
    replaceInFile({
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