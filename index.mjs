#!/usr/bin/env node

import { program } from 'commander';
import InitCon from './controllers/initializationController.mjs';
import CompCon from './controllers/componentController.mjs';
import RouteCon from './controllers/routeController.mjs';
import ModelCon from './controllers/modelController.mjs';

import pkg from './package.json' assert { type: 'json' };

program
  .version(pkg.version)
  .description(pkg.description);

program.command('project [path]')
  .description('Create boilerplate project.  If no path is provided current working directory will be used.')
  .action(function(path){
    path = path || '.';
    InitCon.setupProject(path);
  });

program.command('component <componentName>')
  .option('-r, --remove', 'Remove component')
  .action(function(componentName, opts){
    var path = process.cwd();
    if(opts.remove){
      CompCon.removeComp(path,componentName);
    } else{
      CompCon.createComp(path,componentName);
    }
  });

program.command('route <routeName>')
  .option('-r, --remove', 'Remove route')
  .action(function(routeName, opts){
    var path = process.cwd();
    if(opts.remove){
      RouteCon.removeRoute(path,routeName);
    } else{
      RouteCon.createRoute(path,routeName);
    }
  });

program.command('model <modelName>')
  .option('-r, --remove', 'Remove model')
  .action(function(modelName, opts){
    var path = process.cwd();
    if(opts.remove){
      ModelCon.removeModel(path, modelName);
    } else{
      ModelCon.createModel(path,modelName);
    }
  });
  
program.parse();