
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
  pascalize: function(str){
    if (/^[a-z\d]+$/i.test(str)) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str.replace(
      /([a-z\d])([a-z\d]*)/gi,
      (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
    ).replace(/[^a-z\d]/gi, '');
  },
  dasherize: function(str){
    str = str.charAt(0).toLowerCase()+str.slice(1);
    return str.replace(/[\s_]+/g, '-')
              .replace(/[A-Z]/g, m => "-" + m.toLowerCase());
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