'use strict';

const BroccoliDebug = require('broccoli-debug');
const path = require('path');
const Plugin = require('./lib/plugin');
const pkg = require('./package');

const debugTree = BroccoliDebug.buildDebugCallback(`ember-sfc`);


module.exports = {
  name: pkg.name,

  setupPreprocessorRegistry(type, registry) {
    registry.add('js', {
      name: pkg.name,
      ext: 'ember',
      toTree: (tree) => {
        let input = debugTree(tree, 'input');
        let sfcTree = Plugin([input]);
        let output = debugTree(sfcTree, 'output');
        return output;
      }
    });

    if (type === 'parent') {
      this.parentRegistry = registry;
    }
  },
};
