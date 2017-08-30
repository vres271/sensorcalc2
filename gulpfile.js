//npm install  gulp-csso gulp-imagemin gulp-uglify gulp-concat gulp-js-obfuscator gulp-htmlmin browser-sync --save-dev

var gulp = require('gulp'); // Сообственно Gulp JS
var uglify = require('gulp-uglify'); // Минификация JS
var concat = require('gulp-concat'); // Склейка файлов
var js_obfuscator = require('gulp-js-obfuscator');
var htmlmin = require('gulp-htmlmin');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var gettext     = require('gulp-angular-gettext');
var gettext_export_html = require('gulp-angular-gettext-export-html');
//var gettext = require('gulp-angular-gettext');
//var poConnector = require('gulp-po'); // f7f7ee778a99fbd074ded94c31c4af2d
//var lr = require('tiny-lr'); // Минивебсервер для livereload
//var livereload = require('gulp-livereload') // Livereload для Gulp
//var connect = require('connect'); // Webserver
//var server = lr();
var browserSync = require('browser-sync').create();

function wrapPipe(taskFn) {
  return function(done) {
    var onSuccess = function() {
      done();
    };
    var onError = function(err) {
      done(err);
    }
    var outStream = taskFn(onSuccess, onError);
    if(outStream && typeof outStream.on === 'function') {
      outStream.on('end', onSuccess);
    }
  }
}

// ===========================================================================


gulp.task('default', ['serve']);


gulp.task('L10n',  ['pot','translations','gettext-compile-html']);

gulp.task('pot', function() {
    return gulp.src(['html/views/*.html','index.html'])
        .pipe(gettext.extract('template.pot'))
        .pipe(gulp.dest('localization/'));
}); 

gulp.task('translations', function() {
   return gulp.src('localization/**/*.po')
        .pipe(gettext.compile({format: 'json'}))
        .pipe(gulp.dest('translations/'));
});

gulp.task('gettext-compile-html', function () {
    return gulp.src('html/views/*.html')
                   .pipe(gettext_export_html('localization/**/*.po'))
                   .pipe(gulp.dest('html/views/'))
});


// Server + watching
gulp.task('serve',  function() {

    gulp.run('js');
    gulp.run('html');
    gulp.run('htmlindex');
    gulp.run('css');
    gulp.run('img');
    gulp.run('L10n');

    browserSync.init({
        proxy: "wialoncrm"
    });

    gulp.watch([
        'js/*.js'
        ,'js/**/*.js'
    ],function() {
        gulp.run('js');
    });    

    gulp.watch(['index.html'],function() {
        gulp.run('htmlindex');
    }); 

    gulp.watch(['html/views/*.html'], function() {
        gulp.run('html');
        gulp.run('L10n');

    });  

    gulp.watch(['css/*.css'],  function() {
        gulp.run('css');
    });

    gulp.watch(['img/*'],  function() {
        gulp.run('img');
    });

    gulp.watch([
        "html/views/*.html"
        ,'index.html'
        ,'css/*.css'
        ,'img/*'
        ,'js/*.js'
        ,'js/**/*.js'
    ]).on('change', browserSync.reload);

});





gulp.task('html', wrapPipe(function(success, error) {
    return gulp.src([
          'html/views/*.html'
      ])
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('build/html/views'))
      //.pipe(browserSync.stream())
}));

gulp.task('js', wrapPipe(function(success, error) {
  return gulp.src([
        'js/*.js'
        ,'js/services/*.js'
        ,'js/controllers/*.js'
        ,'js/filters/*.js'
        ,'js/directives/*.js'
    ])
    .pipe(concat('build/js/scripts.js').on('error', error))
    .pipe(uglify().on('error', error))
    .pipe(js_obfuscator({}).on('error', error))
    .pipe(gulp.dest(''));
}));

gulp.task('html', wrapPipe(function(success, error) {
  return gulp.src([
        'html/views/*.html'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/html/views'))
    //.pipe(browserSync.stream())
}));

gulp.task('htmlindex', wrapPipe(function(success, error) {
  return gulp.src([
        'index.html'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/html'))
    //.pipe(browserSync.stream())
}));

gulp.task('css', wrapPipe(function(success, error) {
    return gulp.src(
        ['css/*.css']
    ).pipe(csso({
        restructure: false,
        sourceMap: true,
        debug: true
    }))
    .pipe(gulp.dest('build/css/'));
}));

gulp.task('img', wrapPipe(function(success, error) {
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img/'))

}));





// gulp.task('default', ['translations']);

// gulp.task('pot', function () {
//     return gulp.src(['html/views/*.html'])
//         .pipe(gettext.extract('template.pot', {
//             // options to pass to angular-gettext-tools... 
//         }))
//         .pipe(gulp.dest('po/'));
// });
 
// gulp.task('translations', function () {
//     return gulp.src('po/**/*.po')
//         .pipe(gettext.compile({
//             // options to pass to angular-gettext-tools... 
//             format: 'json'
//         }))
//         .pipe(gulp.dest('build/translations/'));
// });

// gulp.task('gettext-compile-html', function () {
//     return gulp.src('html/views/*.html')
//                    .pipe(gettext_export_html('po1/*.po'))
//                    .pipe(gulp.dest('build/html/views/translated'))
// });

// var options = {
//     apiToken: 'f7f7ee778a99fbd074ded94c31c4af2d',
//     project: 'glomoscrm',
//     langs: {
//         'zh-TW': 'zh'
//     }
// };
// createTranslatesPlumber: function() {
//     return plumber(function(error) {
//         gutil.log(gutil.colors.red(error));
//         gutil.beep();
//         this.emit('end');
//     });
// }
 
// gulp.task('translates-push', function() {
//     return gulp.src('./translates/**/*.json')
//         .pipe(pipes.createTranslatesPlumber())
//         .pipe(poConnector('push', options))
//         .pipe(gulp.dest('./translates/'))
// });
