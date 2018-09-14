App.util.Browser = (function(){
  Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];
  Date.prototype.dayNames = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
  };
  Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
  };
  Date.prototype.getDayName = function(){
    return this.dayNames[this.getDay()];
  };
  Date.prototype.getShortDayName = function(){
    return this.getDayName().substr(0,3);
  };

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
    },
    loadImage: function(url){
      var def = new Deferred();
      if(!url){
        return Promise.reject();
      }

      var $body = document.querySelector('body');
      var $img = document.createElement('img');
      $img.style.position = 'absolute';
      $img.style.opacity = 0;
      $img.style.width = '1px';
      $img.style.height = '1px';
      $img.setAttribute('src', url);
      $body.appendChild($img);
      $img.onload = function(){
        $body.removeChild($img);
        def.resolve();
      };

      return def.promise;
    }
  };
})();