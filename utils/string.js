
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

var StrUtil = {
  
};

module.exports = StrUtil;