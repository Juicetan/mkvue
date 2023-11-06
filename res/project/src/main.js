import { ref, createApp } from 'vue'
import { createPinia } from 'pinia'
import mitt from 'mitt';

import App from './App.vue'
import router from './router'

import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"

import './assets/css/main.scss'


let appState = ref({
  isLoading: false
})

const app = createApp(App, {
  state: appState
});

// app.config.errorHandler = (err) => {
//   /* handle error */
// }

app.use(createPinia())
app.use(router)

app.mount('#app')

app.toast = function(msg, type, duration){
  type = type || 'normal';

  if(typeof msg === 'object'){
    try{
      msg = JSON.stringify(msg);
    } catch(e){
      console.log('> toast stringify fail', e);
    }
  }

  var opt = {
    text: msg,
    gravity: 'bottom',
    duration: 3000,
  };
  if(type === 'error'){
    opt.backgroundColor = '#b20000';
    opt.duration = 7000;
  }
  if(duration){
    opt.duration = duration;
  }

  Toastify(opt).showToast();
}

app.evt = mitt();
app.actions = {
  LOADING: 'loading'
};

const loaderStack = [];
var loadStart = 0;

app.evt.on(app.actions.LOADING, function(bool, noDelay){
  if (bool) {
    appState.value.isLoading = true;
    if (loaderStack.length <= 0) {
      loadStart = new Date().getTime();
    }
    loaderStack.push(true);
  } else if (!bool && loaderStack.length > 1) {
    loaderStack.pop();
  } else if (!bool) {
    loaderStack.pop();
    const now = new Date().getTime();
    if (now - loadStart < 300 && !noDelay) {
      setTimeout(function () {
        appState.value.isLoading = false;
      }, 300);
    } else {
      appState.value.isLoading = false;
    }
  }
})

window.App = app;