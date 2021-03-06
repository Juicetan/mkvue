App.util.Obj = (function(){
  var s4 = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  };
  
  var Obj = {
    guid:function(tuples){
      var str = 'js';
      if(tuples && tuples > 0){
        for(var i = 0; i < tuples; i++){
          str += str !== 'js'?'-'+s4():s4();
        }
        return str;
      }
      return 'js' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
    },
    zero2Pad: function(num){
      return ('0'+num).slice(-2);
    },
    removeObject:function(arr,obj,findCallback){
      var index = arr.indexOf(obj);

      if(findCallback){
        var objs = arr.filter(findCallback);
        if(objs.length > 0){
          index = arr.indexOf(objs[0]);
        }
      }

      if(index >= 0){
        return arr.splice(index,1);
      }
      return arr;
    },
    difference: function(currentSource, sourceOfTruth){
      var diff = [];

      for(var i = 0; i < currentSource.length; i++){
        if(sourceOfTruth.indexOf(currentSource[i]) < 0){
          diff.push(currentSource[i]);
        }
      }
      return diff;
    },
    intersection: function(currentSource, sourceOfTruth){
      var union = [];

      for(var i = 0; i < currentSource.length; i++){
        if(sourceOfTruth.indexOf(currentSource[i]) > -1){
          union.push(currentSource[i]);
        }
      }
      return union;
    },
    hash: function(str) {
      var hash = 0, i, chr;
      if (str.length === 0) return hash;
      for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return 'f'+hash;
    },
    replaceAllStr: function(str, search, replacement){
      return str.split(search).join(replacement);
    },
    getContrastYIQ: function(hexcolor){
      var r = parseInt(hexcolor.substr(0,2),16);
      var g = parseInt(hexcolor.substr(2,2),16);
      var b = parseInt(hexcolor.substr(4,2),16);
      var yiq = ((r*299)+(g*587)+(b*114))/1000;
      return (yiq >= 128) ? 'black' : 'white';
    },
  };

  Obj.extend = (function(){
    function isMergeableObject(val) {
      var nonNullObject = val && typeof val === 'object';

      return nonNullObject && Object.prototype.toString.call(val) !== '[object RegExp]' && Object.prototype.toString.call(val) !== '[object Date]';
    }

    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {};
    }

    function cloneIfNecessary(value, optionsArgument) {
      var clone = optionsArgument && optionsArgument.clone === true;
      return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value;
    }

    function defaultArrayMerge(target, source, optionsArgument) {
      var destination = target.slice();
      source.forEach(function (e, i) {
        if (typeof destination[i] === 'undefined') {
          destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (isMergeableObject(e)) {
          destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
          destination.push(cloneIfNecessary(e, optionsArgument));
        }
      });
      return destination;
    }

    function mergeObject(target, source, optionsArgument) {
      var destination = {};
      if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
          destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
      }
      Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
          destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
          destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
      });
      return destination;
    }

    function deepmerge(target, source, optionsArgument) {
      var array = Array.isArray(source);
      var options = optionsArgument || { arrayMerge: defaultArrayMerge };
      var arrayMerge = options.arrayMerge || defaultArrayMerge;

      if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument);
      } else {
        return mergeObject(target, source, optionsArgument);
      }
    }

    deepmerge.all = function deepmergeAll(array, optionsArgument) {
      if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements');
      }

      // we are sure there are at least 2 values, so it is safe to have no initial value
      return array.reduce(function (prev, next) {
        return deepmerge(prev, next, optionsArgument);
      });
    };

    return deepmerge;
  })();

  return Obj;
})();