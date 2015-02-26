'use strict';

module.exports = {
  jade: {
    name: 'jade',
    display: 'Jade',
    adapter: 'static2000-jade',
    glob: 'jade',
    ext: 'jade',
    comment: '//- <%= comment %>\n'
  },
  nunjucks: {
    name: 'nunjucks',
    display: 'Nunjucks',
    adapter: 'static2000-nunjucks',
    glob: 'html',
    ext: 'html',
    comment: '{# <%= comment %> #}\n'
  },
  swig: {
    name: 'swig',
    display: 'Swig',
    adapter: 'static2000-swig',
    glob: 'html',
    ext: 'html',
    comment: '{# <%= comment %> #}\n'
  }
};
