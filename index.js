#!/usr/bin/env node

var cmd = require('commander');
var InitCon = require('./controllers/initializationController');
var CompCon = require('./controllers/componentController');

cmd
  .version('1.0.0')
  .description('A NodeJS command line utility to assist in creating componentized VueJS applications.')
  .parse(process.argv);

cmd.command('project [path]')
  .description('Create boilerplate project.  If no path is provided current working directory will be used.')
  .action(function(path){
    path = path || '.';
    InitCon.setupProject(path);
  });

cmd.command('component <componentName>')
  .action(function(componentName){
    var path = process.cwd();
    CompCon.createComp(path,componentName);
  });
  
cmd.parse(process.argv);

var App = {
  init: function(path){
    
  }
};