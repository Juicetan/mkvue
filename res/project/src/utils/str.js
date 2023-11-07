
var StrUtil = {
  zero2Pad: function (num) {
    return ('0' + num).slice(-2);
  },
  hash: function (str) {
    var hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return 'f' + hash;
  },
};

export default StrUtil;