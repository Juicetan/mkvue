var gulp = require('gulp');
var clean = require('del');
var sass = require('gulp-dart-sass');
var prefix = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var rev = require('gulp-rev');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps')
var flatten = require('gulp-flatten');
var fileInclude = require('gulp-file-include');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var git = require('git-rev');
var fs = require('fs');
var browserSync = require('browser-sync').create();

var paths = {
  dom: './*.html',
  app: './app/**/*',
  images: './images/*',
  fonts: './fonts/*',
  resources: './res/*',
  styles: ['./css/**/*.scss', './css/**/*.css'],
  updatePath: './dist/**/*.html'
};

var applicationShellFiles = [];

var startLiveReloadServer = function(){
  browserSync.init({
    open: false,
    ghostMode: false,
    port: 3200,
    server: {
      baseDir: 'dist'
    }
  });
  console.log("> started live reload server");
};

var changeDetected = function(file){
  console.log('> change detected',file);

  gulp.series('dev')(function(){
    browserSync.reload();
  });
};

gulp.task('clean',function(){
  return clean([
    './.tmp',
    './dist'
  ]);
});

gulp.task('gatherComponents',function(){
  return gulp.src('./app/**/*.html')
    .pipe(replace(/<!-- tid:(.+?) -->/i, '<script type="x-template" id="$1">'))
    .pipe(insert.append('</script>'))
    .pipe(gulp.dest('./.tmp/templates/'));
});

gulp.task('assembleIndex',function(){
  return gulp.src('./index.html')
    .pipe(fileInclude({
      basepath: './.tmp/'
    }))
    .pipe(gulp.dest('./.tmp'));
});

var moveActions = {
  appFiles: function(){
    return gulp.src([
      './app/**/*'
    ]).pipe(gulp.dest('./.tmp/app'));
  },
  appImages: function(){
    return gulp.src([
      './images/**/*'
    ]).pipe(gulp.dest('./.tmp/images'));
  },
  devConfig: function(){
    return gulp.src([
      './res_dev/**'
    ]).pipe(gulp.dest('./.tmp/res'));
  },
  config: function(){
    return gulp.src([
      './res/**'
    ]).pipe(gulp.dest('./.tmp/res'));
  },
  styles: function(){
    return gulp.src('./app/**/*.css')
      .pipe(flatten())
      .pipe(gulp.dest('./.tmp/app/base/css'))
  },
  computedStyles: function(){
    return gulp.src('./app/**/*.scss')
      .pipe(sass())
      .pipe(prefix("last 2 versions"))
      .pipe(flatten())
      .pipe(gulp.dest('./.tmp/app/base/css'));
  },
  static: {
    fonts: function(){
      return gulp.src('./.tmp/**/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest('./dist/fonts'));
    },
    images: function(){
      return gulp.src('./.tmp/images/**/*')
        .pipe(flatten())
        .pipe(gulp.dest('./dist/images'));
    },
    manifest: function(){
      return gulp.src('./.tmp/res/manifest.json')
        .pipe(flatten())
        .pipe(gulp.dest('./dist/res/'))
    },
    config: function(){
      var configFilename = 'config.json';

      return gulp.src('./.tmp/res/'+configFilename)
        .pipe(flatten())
        .pipe(gulp.dest('./dist/res'));
    }
  }
};

gulp.task('gatherDevMaterials', gulp.parallel(
  moveActions.appFiles,
  moveActions.appImages,
  moveActions.styles,
  moveActions.computedStyles,
  moveActions.devConfig
));

gulp.task('gatherMaterials', gulp.parallel(
  moveActions.appFiles,
  moveActions.appImages,
  moveActions.styles,
  moveActions.computedStyles,
  moveActions.config
));

gulp.task('useminifyProd', function(){
  return gulp.src('./.tmp/index.html')
    .pipe(usemin({
      jslib: [sourcemaps.init(),uglify,rev,sourcemaps.write('./')],
      jsapp: [sourcemaps.init(),uglify,rev,sourcemaps.write('./')],
      html: [htmlmin({collapseWhitespace:true})],
      css: [minifyCSS,rev]
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('useminifyDev', function(){
  return gulp.src('./.tmp/index.html')
    .pipe(usemin({
      css: [minifyCSS,rev],
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copyExternals', gulp.parallel(
  moveActions.static.fonts,
  moveActions.static.images,
  moveActions.static.manifest,
  moveActions.static.config,
));

gulp.task('watchChanges',function(){
  startLiveReloadServer();

  gulp.watch(paths.app).on('change', changeDetected);
  gulp.watch(paths.dom).on('change', changeDetected);
  gulp.watch(paths.resources).on('change', changeDetected);
});

gulp.task('getVersion',function(done){
  return git.branch(function(branchStr){
    git.short(function(hash){
      var packageFile = fs.readFileSync('./package.json');
      packageFile = JSON.parse(packageFile);
      fs.writeFileSync('./dist/version.txt', 'v'+packageFile.version+"-"+branchStr+":"+hash);
      done();
    });
  });
});

gulp.task('prod', gulp.series('clean','gatherMaterials','gatherComponents','assembleIndex','useminifyProd','copyExternals','getVersion'));

gulp.task('dev', gulp.series('clean','gatherDevMaterials','gatherComponents','assembleIndex','useminifyDev','copyExternals','getVersion'));

gulp.task('serve', gulp.series('clean','dev','watchChanges'));

gulp.task('default', gulp.series('prod'));
