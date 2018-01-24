#!/usr/bin/env node

var cmd = require('commander');
var InitCon = require('./controllers/initializationController');
var CompCon = require('./controllers/componentController');
var RouteCon = require('./controllers/routeController');
var ModelCon = require('./controllers/modelController');

cmd
  .version('0.1.1')
  .description('A NodeJS command line utility to assist in creating componentized VueJS applications.');

cmd.command('project [path]')
  .description('Create boilerplate project.  If no path is provided current working directory will be used.')
  .action(function(path){
    path = path || '.';
    InitCon.setupProject(path);
  });

cmd.command('component <componentName>')
  .option('-r, --remove', 'Remove component')
  .action(function(componentName, opts){
    var path = process.cwd();
    if(opts.remove){
      CompCon.removeComp(path,componentName);
    } else{
      CompCon.createComp(path,componentName);
    }
  });

cmd.command('route <routeName>')
  .action(function(routeName){
    var path = process.cwd();
    RouteCon.createRoute(path,routeName);
  });

cmd.command('model <modelName>')
  .action(function(modelName){
    var path = process.cwd();
    ModelCon.createModel(path,modelName);
  });
  
cmd.parse(process.argv);

var App = {
  init: function(path){
    
  }
};