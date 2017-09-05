App.util.Browser = (function(){
  return {
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
    getURLParam:function(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.href);
      if (results === null)
        return "";
      else
        return results[1];
    }
  };
})();