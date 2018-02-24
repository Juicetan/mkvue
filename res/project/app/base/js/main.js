var App = (function(){
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
        app.cfg = App.util.Obj.extend(app.cfg,json.defaults);
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

  App.vm = new Vue({
    router: router,
    el: '.container',
    data: function(){
      return {
        isLoaded: false,
        isLoading: false,
        isCFGLoaded: false,
        errorText: '',
        sessionUser: null
      };
    },
    computed: {
    },
    watch: {
    },
    methods: {
      refreshApp: function(){
        window.location.reload();
      }
    },
    mounted: function(){
      this.isLoaded = true;
    },
  });
  
  /**
   * Resusing the Vue event emitter interface but keeping it generic so we can
   * swap it out for our favourite event emitter if we ever need to.
   */
  App.vm.on = App.vm.$on;
  App.vm.emit = App.vm.$emit;
  App.evt = App.vm;

  var loaderStack = [];
  var loadStart = 0;
  App.evt.on(App.actions.LOADING,function(bool, noDelay){
    if(bool){
      App.vm.isLoading = true;
      if(loaderStack.length <= 0){
        loadStart = new Date().getTime();
      }
      loaderStack.push(true);
    } else if(!bool && loaderStack.length > 1){
      loaderStack.pop();
    } else if(!bool){
      loaderStack.pop();
      var now = new Date().getTime();
      if(now - loadStart < 300 && !noDelay){
        setTimeout(function(){
          App.vm.isLoading = false;
        },300);
      } else{
        App.vm.isLoading = false;
      }
    }
  });

  return App;
})();