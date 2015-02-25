'use strict';

module.exports = {
  jade: {
    name: 'jade',
    adapter: 'static2000-jade',
    glob: 'jade',
    ext: 'jade',
    comment: '//- <%= comment %>\n'
  },
  swig: {
    name: 'swig',
    adapter: 'static2000-swig',
    glob: 'html',
    ext: 'html',
    comment: '{# <%= comment %> #}\n'
  }
};
