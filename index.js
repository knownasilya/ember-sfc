'use strict';

const BroccoliDebug = require('broccoli-debug');
const path = require('path');
const Plugin = require('./lib/plugin');

const debugTree = BroccoliDebug.buildDebugCallback(`some-awesome`);


module.exports = {
  name: require('./package').name,

  setupPreprocessorRegistry(type, registry) {
    registry.add('js', {
      name: 'ember-sfc',
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
