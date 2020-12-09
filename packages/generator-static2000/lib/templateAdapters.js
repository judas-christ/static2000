'use strict';

module.exports = {
  pug: {
    name: 'pug',
    display: 'Pug',
    adapter: 'static2000-pug',
    glob: 'pug',
    ext: 'pug',
    comment: '//- <%= comment %>\n'
  },
  nunjucks: {
    name: 'nunjucks',
    display: 'Nunjucks',
    adapter: 'static2000-nunjucks',
    glob: 'html',
    ext: 'html',
    comment: '{# <%= comment %> #}\n'
  }
  // swig: {
  //   name: 'swig',
  //   display: 'Swig',
  //   adapter: 'static2000-swig',
  //   glob: 'html',
  //   ext: 'html',
  //   comment: '{# <%= comment %> #}\n'
  // }
};
