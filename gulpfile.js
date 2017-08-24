var gulp = require('gulp'), // Сообственно Gulp JS
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    js_obfuscator = require('gulp-js-obfuscator'),
    htmlmin = require('gulp-htmlmin'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    lr = require('tiny-lr'), // Минивебсервер для livereload
    livereload = require('gulp-livereload') // Livereload для Gulp
    server = lr();

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

// Локальный сервер для разработки
gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('/'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

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
    .pipe(gulp.dest('build/html/views'));
}));

gulp.task('htmlindex', wrapPipe(function(success, error) {
  return gulp.src([
        'index.html'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/html'));
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

gulp.task('watch', function() {

    gulp.run('js');
    gulp.run('html');
    gulp.run('htmlindex');
    gulp.run('css');
    gulp.run('img');


    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch([
            'js/*.js'
            ,'js/services/*.js'
            ,'js/controllers/*.js'
            ,'js/filters/*.js'
            ,'js/directives/*.js'
        ],function() {
            gulp.run('js');
        });    

        gulp.watch(['index.html'],function() {
            gulp.run('htmlindex');
        }); 

        gulp.watch(['html/views/*.html'], function() {
            gulp.run('html');
        });  

        gulp.watch(['css/*.css'],  function() {
            gulp.run('css');
        });

        gulp.watch(['img/*'],  function() {
            gulp.run('img');
        });

    });
    gulp.run('http-server');

});