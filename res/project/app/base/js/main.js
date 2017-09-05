var newApp = (function(){
  var deferredReady = new Deferred();

  var App = {
    ready: deferredReady.promise,
    vm: null,
    evt: null,
    ext:{
      CONFIG:"res/config.json",
      VERSION: 'version.txt'
    },
    actions:{
      LOADING: "loading",
      CONFIG_UPDATE: "configupdated"
    },
    cfg: {},
    util: {},
    initConfig:function(){
      var app = this;
      var def = new Deferred();

      fetch(this.ext.CONFIG).then(function(resp){
        if(resp.status !== 200){
          throw new Validation().addError("Configuration file not found","Reverting to default configuration. No configuration found at:"+app.ext.CONFIG,{
            code: Flybits.Validation.type.MISSINGARG
          });
        }
        return resp.json();
      }).then(function(json){
        app.cfg = ObjUtil.extend(app.cfg,json.defaults);
        app.vm.isDebug = app.cfg.debug;
        def.resolve(app.cfg);
      }).catch(function(ex){
        if(ex instanceof Validation){
          def.reject(ex);
        } else{
          def.reject(new Validation().addError("Failed to read configuration file.","Reverting to default configuration. Configuration format incorrect at:"+app.ext.CONFIG,{
            code: Validation.type.MALFORMED
          }));
        }
      });

      return def.promise;
    },
    checkVersion: function(){
      fetch(this.ext.VERSION).then(function(resp){
        return resp.text();
      }).then(function(fileStr){
        console.debug(fileStr);
      });
    },
  };

  var router = App.router = new VueRouter({
    routes: [{
      path: '/',
      name: 'splash',
      component: SplashPage,
      alias: '/splash'
    }]
  });

})();