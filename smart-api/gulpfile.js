const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const compile = require('./config/swagger/compile');

gulp.task('nodemon', () => {
  nodemon({
    script: 'app.js',
    ext: 'js json',
    ignore: ['var/', 'node_modules/'],
  }).on('restart', () => {
    console.log('>> node restart');
  });
});

gulp.task('build', () => {
  compile.compileSwagger().then(result => console.log(result));
});

gulp.task('watch', () => {
  gulp.watch('api/swagger/**/*.yaml', ['build']);
});

gulp.task('default', ['build', 'watch', 'nodemon']);
