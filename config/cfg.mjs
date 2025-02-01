
var CFG = {
  path: {
    ROUTE: './src/views',
    COMPONENT: './src/components',
    MODEL: './src/models',
    ROUTER: './src/router/index.js'
  },
  delimsRegex: {
    ROUTESIMPORTSTART: /\/\* !!-- routes import start --!! \*\/\r?\n/,
    ROUTESIMPORTEND: /\/\* !!-- routes import end --!! \*\/\r?\n/,
    ROUTESSTART: /\/\* !!-- routes start --!! \*\/\r?\n/,
    ROUTESEND: /\/\* !!-- routes end --!! \*\/\r?\n/
  },
  delims: {
    ROUTESIMPORTSTART: '/* !!-- routes import start --!! */',
    ROUTESIMPORTEND: '/* !!-- routes import end --!! */',
    ROUTESSTART: '/* !!-- routes start --!! */',
    ROUTESEND: '/* !!-- routes end --!! */'
  }
};


export default CFG;