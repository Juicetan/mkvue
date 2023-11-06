
var CFG = {
  path: {
    ROUTE: './src/views',
    COMPONENT: './src/components',
    MODEL: './src/models',
  },
  style: {
    COMPSTART: '/** components:start **/',
    COMPEND: '/** components:end **/',
    ROUTESTART: '/** routes:start **/',
    ROUTEEND: '/** routes:end **/'
  },
  script: {
    COMPSTART: '<!-- components:script:start -->',
    COMPEND: '<!-- components:script:end -->',
    ROUTESTART: '<!-- routes:script:start -->',
    ROUTEEND: '<!-- routes:script:end -->',
    MODELSTART: '<!-- models:script:start -->',
    MODELEND: '<!-- models:script:end -->'
  },
  template: {
    COMPSTART: '<!-- components:template:start -->',
    COMPEND: '<!-- components:template:end -->',
    ROUTESTART: '<!-- routes:template:start -->',
    ROUTEEND: '<!-- routes:template:end -->',
  }
};


module.exports = CFG;