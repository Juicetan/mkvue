#!/usr/bin/env node

var cmd = require('commander');
var InitCon = require('./controllers/InitializationController');

cmd
  .version('1.0.0');

cmd.command('project [path]')
  .description('Create boilerplate project.  If no path is provided current working directory will be used.')
  .action(function(path){
    path = path || '.';
    InitCon.setupProject(path);
  });

cmd.command('component <componentName>')
  .action(function(componentName){
    console.log('>2 ',componentName);
  });
  
cmd.parse(process.argv);

var App = {
  init: function(path){
    
  }
};