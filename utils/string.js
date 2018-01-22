
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

var StrUtil = {
  camelize: function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  },
  extractBlock: function(str, blockStart, blockEnd){
    var startSplit = str.split(blockStart);
    var endSplit = startSplit[1].split(blockEnd);

    var extraction = {
      preBlock: startSplit[0],
      block: endSplit[0],
      postBlock: endSplit[1]
    };

    return extraction;
  },
};

module.exports = StrUtil;