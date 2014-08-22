var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'xit'
    },
    port: 3000,
    db: 'mongodb://localhost/xit'

  },

  test: {
    root: rootPath,
    app: {
      name: 'xit'
    },
    port: 3000,
    db: 'mongodb://localhost/xit-test'

  },

  production: {
    root: rootPath,
    app: {
      name: 'xit'
    },
    port: 3000,
    db: 'mongodb://localhost/xit'

  }
};

module.exports = config[env];
