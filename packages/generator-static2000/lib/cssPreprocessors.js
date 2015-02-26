'use strict';

module.exports = {
  scss: {
    name: 'scss',
    display: 'Sass (scss)',
    plugin: 'gulp-sass',
    glob: '{sass,scss}',
    ext: 'scss',
    comment: '// <%= comment %>\n'
  },
  sass: {
    name: 'sass',
    display: 'Sass (sass)',
    plugin: 'gulp-sass',
    glob: '{sass,scss}',
    ext: 'sass',
    comment: '// <%= comment %>\n'
  },
  less: {
    name: 'less',
    display: 'Less',
    plugin: 'gulp-less',
    glob: 'less',
    ext: 'less',
    comment: '// <%= comment %>\n'
  }
};
