

var s4 = function(){
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

var ObjUtil = {
  guid: function(tuples){
    var str = '';
    if (tuples && tuples > 0) {
      for (var i = 0; i < tuples; i++) {
        str += str !== '' ? '-' + s4() : s4();
      }
      return str;
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  },
  getByStr: function (obj, keyStr) {
    // convert indexes to properties
    keyStr = keyStr.replace(/\[(\w+)\]/g, '.$1');
    // strip a leading dot
    keyStr = keyStr.replace(/^\./, '');
    var aKeys = keyStr.split('.');
    for (var i = 0, n = aKeys.length; i < n; ++i) {
      var key = aKeys[i];
      if (key in obj) {
        obj = obj[key];
      } else {
        return;
      }
    }
    return obj;
  },
  setByStr: function (obj, keyStr, val) {
    // convert indexes to properties
    keyStr = keyStr.replace(/\[(\w+)\]/g, '.$1');
    // strip a leading dot
    keyStr = keyStr.replace(/^\./, '');
    var aKeys = keyStr.split('.');
    for (var i = 0, n = aKeys.length; i < n; i++) {
      var key = aKeys[i];
      if (key in obj && i + 1 < n) {
        obj = obj[key];
      } else if (!(key in obj) && i + 1 < n) {
        obj[key] = {};
        obj = obj[key];
      } else {
        obj[key] = val;
        return val;
      }
    }
  },
  removeObject: function (arr, obj, findCallback) {
    var index = arr.indexOf(obj);

    if (findCallback) {
      var objs = arr.filter(findCallback);
      if (objs.length > 0) {
        index = arr.indexOf(objs[0]);
      }
    }

    if (index >= 0) {
      return arr.splice(index, 1);
    }
    return arr;
  },
  debounce: function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
};

ObjUtil.extend = (function () {
  function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return (
      nonNullObject &&
      Object.prototype.toString.call(val) !== '[object RegExp]' &&
      Object.prototype.toString.call(val) !== '[object Date]'
    );
  }

  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }

  function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return clone && isMergeableObject(value)
      ? deepmerge(emptyTarget(value), value, optionsArgument)
      : value;
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
      return Array.isArray(target)
        ? arrayMerge(target, source, optionsArgument)
        : cloneIfNecessary(source, optionsArgument);
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

export default ObjUtil;