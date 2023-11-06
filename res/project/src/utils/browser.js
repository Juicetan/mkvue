
var BrowserUtil = {
  getCookie: function(key) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + key + "=");
    if (parts.length == 2) {
      return parts.pop().split(";").shift();
    } else{
      return null;
    }
  },
  setCookie: function(key,value,expiryDateObj){
    var expires = "";
    if (expiryDateObj) {
      expires = "; expires=" + expiryDateObj.toGMTString();
    }
    document.cookie = key + "=" + value + expires + "; path=/";
  },
  getURLParam:function(name, uri) {
    uri = uri || window.location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(uri);
    if (results === null)
      return "";
    else
      return results[1];
  },
  toURLParamString: function(obj){
    var objKeys = Object.keys(obj);
    var str = '?';
    var keyValArr = objKeys.map(function(key){
      return key + '=' + obj[key];
    });

    return str + keyValArr.join('&');
  },
  saveAs: function(str, filename){
    str = encodeURIComponent(str);

    var $link = document.createElement('a');
    $link.style.position = 'absolute';
    $link.style.width = '1px';
    $link.style.height = '1px';
    $link.style.opacity = '0';
    
    var $body = document.querySelector('body');
    
    $link.setAttribute('download', filename);
    $link.setAttribute('href', 'data:application/octet-stream,'+ str);

    $body.appendChild($link);

    $link.click();
  }
};

export default BrowserUtil;