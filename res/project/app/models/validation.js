var Validation = (function(){
  function Validation(){
    this.state = true;
    this.errors = [];

    this.stacktrace = "";

    this.setStackTrace();
  }

  Validation.prototype = {
    addError: function(header,message,detailsObj){
      this.state = false;
      var retObj = {
        header: header,
        message: message
      };
      if(detailsObj){
        retObj.context = detailsObj.context;
        retObj.code = detailsObj.code;
        retObj.serverCode = detailsObj.serverCode;
      }
      this.errors.push(retObj);

      return this;
    },
    firstError: function(){
      if(this.errors.length > 0){
        return this.errors[0];
      }
      return null;
    },
    setStackTrace: function(){
      var flyError = new Error();
      flyError.name = "FlybitsError";
      this.stacktrace = flyError.stack;
      if(this.stacktrace){
        this.stacktrace = this.stacktrace.split('\n').filter(function(str){
          return str.indexOf('Validation') < 0;
        }).join('\n');
      }
      return this;
    }
  };

  Validation.prototype.type = Validation.type = {};
  Validation.prototype.type.MALFORMED = Validation.type.MALFORMED = 1000;
  Validation.prototype.type.INVALIDARG = Validation.type.INVALIDARG = 1001;
  Validation.prototype.type.MISSINGARG = Validation.type.MISSINGARG = 1002;
  Validation.prototype.type.NOTFOUND = Validation.type.NOTFOUND = 1003;
  Validation.prototype.type.CONNECTIONERROR = Validation.type.CONNECTIONERROR = 1004;
  Validation.prototype.type.UNAUTHENTICATED = Validation.type.UNAUTHENTICATED = 1005;
  Validation.prototype.type.RETRIEVALERROR = Validation.type.RETRIEVALERROR = 1006;
  Validation.prototype.type.NOTSUPPORTED = Validation.type.NOTSUPPORTED = 1007;
  Validation.prototype.type.UNEXPECTED = Validation.type.UNEXPECTED = 1008;

  return Validation;
})();
