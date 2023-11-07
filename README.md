# mkvue

A NodeJS command line utility to assist in the creation of VueJS v3 applications built using Vite's own scaffolded project.

This CLI tool can create instances of a templated project and assist in common tasks like creating/removing Routes, Components, and Models.  Along with creating/removing the necessary files, this tool will also update their registration, specifically regarding application Routes.

The goal is to minimize the tedious work one must do while creating an application and provide the most frictionless process.

<a href="https://nodei.co/npm/mkvue/"><img src="https://nodei.co/npm/mkvue.png?downloads=true&downloadRank=true&stars=true"></a>

## Getting Started

1. Install the utility
  ```shell
  $ npm install mkvue -g
  ```
This will install the utility in the global namespace for you to use in any directory.

## Commands

### $ mkvue [-V, --version]

**-V, --version**
Prints out current version of CLI tool.

### $ mkvue project [fullProjectPath]

**fullProjectPath**
This project path must include the project folder name or else it'll dump the project contents into the last folder in the path.  If `fullProjectPath` is not provided, the current working directory will be used as the new project folder.

### $ mkvue route [-r, --remove] [routeName]

This command must be run in the root of the project folder.  Note that route names will be turned into Pascal case class names, but camel case uri route strings.

**-r, --remove**
Removes the route files/dependency specification with the provided `routeName`.

### $ mkvue component [-r, --remove] [componentName]

This command must be run in the root of the project folder.  Note that component names will be turned into Pascal case class names, with dash separated CSS selector names.

**-r, --remove**
Removes the component files/dependency specification with the provided `componentName`.

### $ mkvue model [-r, --remove] [modelName]

This command must be run in the root of the project folder.  Note that model names will be turned into Pascal case class names.

**-r, --remove**
Removes the model files/dependency specification with the provided `modelName`.