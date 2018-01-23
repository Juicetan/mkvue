var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var rev = require('gulp-rev');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps')
var es = require('event-stream');
var runSync = require('run-sequence');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var fileInclude = require('gulp-file-include');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var git = require('git-rev');
var fs = require('fs');
var fsUtil = require('fs-utils');
var tap = require('gulp-tap');
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
    port: 3200,
    server: {
      baseDir: 'dist'
    }
  });
  console.log("> started live reload server");
};

var changeDetected = function(file){
  console.log('> change detected',file);

  runSync('dev',function(){
    browserSync.reload();
  });
};

gulp.task('clean',function(){
  return es.concat(
    gulp.src('./.tmp').pipe(clean()),
    gulp.src('./dist').pipe(clean())
  );
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

gulp.task('gatherDevMaterials', function(){
  return es.concat(
    gulp.src('./app/**/*').pipe(gulp.dest('./.tmp/app')),
    gulp.src('./images/**').pipe(gulp.dest('./.tmp/images')),
    gulp.src('./fonts/**').pipe(gulp.dest('./.tmp/fonts')),
    gulp.src('./res_dev/**').pipe(gulp.dest('./.tmp/res')),
    gulp.src('./app/**/*.css')
      .pipe(flatten())
      .pipe(gulp.dest('./.tmp/app/base/css')),
    gulp.src('./app/**/*.scss')
      .pipe(sass())
      .pipe(prefix("last 2 versions"))
      .pipe(flatten())
      .pipe(gulp.dest('./.tmp/app/base/css'))
  );
});

gulp.task('gatherMaterials', function(){
  return es.concat(
    gulp.src('./app/**/*').pipe(gulp.dest('./.tmp/app')),
    gulp.src('./images/**').pipe(gulp.dest('./.tmp/images')),
    gulp.src('./fonts/**').pipe(gulp.dest('./.tmp/fonts')),
    gulp.src('./res/**').pipe(gulp.dest('./.tmp/res')),
    gulp.src('./app/**/*.css')
      .pipe(flatten())
      .pipe(gulp.dest('./.tmp/app/base/css')),
    gulp.src('./app/**/*.scss')
      .pipe(sass())
      .pipe(prefix("last 2 versions"))
      .pipe(flatten())
      .pipe(gulp.dest('./.tmp/app/base/css'))
  );
});

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

gulp.task('concatOverrides',function(){
  return gulp.src(['./.tmp/css/styles.css','./.tmp/css/buildOverrides.css'])
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./.tmp/css'));
});

gulp.task('copyExternals',function(){
  return es.concat(
    gulp.src('./.tmp/**/fonts/*')
      .pipe(flatten())
      .pipe(gulp.dest('./dist/fonts')),
    gulp.src('./.tmp/images/**/*')
      .pipe(flatten())
      .pipe(gulp.dest('./dist/images')),
    gulp.src('./.tmp/res/**/*')
      .pipe(flatten())
      .pipe(gulp.dest('./dist/res'))
  );
});

gulp.task('assembleCacheDep',function(){
  return es.concat(
    gulp.src(['./dist/*.js','./dist/*.css','./dist/*.html','./dist/*.txt'])
      .pipe(tap(function(file,t){
        var fileName = './'+fsUtil.last(file.path);
        applicationShellFiles.push(fileName);
      })),
    gulp.src('./dist/res/*.json')
      .pipe(tap(function(file,t){
        var fileName = './res/'+fsUtil.last(file.path);
        applicationShellFiles.push(fileName);
      })),
    gulp.src('./dist/images/*')
      .pipe(tap(function(file,t){
        var fileName = './images/'+fsUtil.last(file.path);
        applicationShellFiles.push(fileName);
      }))
  );
});

gulp.task('buildCacheDep',function(){
  return gulp.src('./.tmp/js/sw.js')
    .pipe(replace(/\/\*file-arr\*\//i,JSON.stringify(applicationShellFiles)))
    .pipe(replace(/\/\*cache-id\*\//i,"'cache-"+new Date().getTime()+"'"))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watchChanges',function(){
  startLiveReloadServer();

  gulp.watch(paths.dom,changeDetected);
  gulp.watch(paths.templates,changeDetected);
  gulp.watch(paths.scripts,changeDetected);
  gulp.watch(paths.resources,changeDetected);
  gulp.watch(paths.styles,changeDetected);
});

gulp.task('getVersion',function(){
  return git.branch(function(branchStr){
    git.short(function(hash){
      fs.writeFile('./dist/version.txt',
        "tdgo:"+branchStr+":"+hash);
    });
  });
});

gulp.task('default', ['prod']);

gulp.task('prod',function(callback){
  runSync('gatherMaterials','gatherComponents','assembleIndex','concatOverrides','useminifyProd','copyExternals','assembleCacheDep','getVersion','buildCacheDep',callback);
});

gulp.task('dev',function(callback){
  runSync('gatherDevMaterials','gatherComponents','assembleIndex','concatOverrides','useminifyDev','copyExternals','assembleCacheDep','getVersion','buildCacheDep',callback);
});

gulp.task('serve',function(callback){
  runSync('clean','dev','watchChanges',callback);
});
