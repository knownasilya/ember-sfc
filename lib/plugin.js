const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const fs = require('fs');
const path = require('path');

const templateRegex = /<\s*template[^>]*>([\s\S]+?)<\s*\/\s*template>/gm;

class SFCPlugin extends Plugin {
  constructor(inputNodes, options = {}) {
    super(inputNodes, options);

    this.fileMatchers = options.globs || ['app/**/*.ember'];
  }

  build() {
    const walkOptions = {
      includeBasePath: true,
      directories: true,
      globs: this.fileMatchers,
    };

    this.inputPaths.forEach((inputPath) => {
      walkSync(inputPath, walkOptions)
        .map(file => {
          let inputContent = fs.readFileSync(file, { encoding: 'UTF-8' });
          let [fullTemplate, templateContent] = templateRegex.exec(inputContent);
          let fileBasePath = path.dirname(file);
          let componentBasePath = fileBasePath.replace('.ember', '/');
          let templatePath = componentBasePath + 'template.hbs';
          let componentContent = inputContent.replace(fullTemplate, '');
          let componentPath = componentBasePath + 'component.js';
          debugger;
          fs.mkdirSync(`${this.outputPath}/${componentBasePath}`, { recursive: true });
          fs.writeFileSync(`${this.outputPath}/${templatePath}`, templateContent);
          fs.writeFileSync(`${this.outputPath}/${componentPath}`, componentContent);
        });
    });
  }
}

module.exports = function sfcPlugin(...params) {
  return new SFCPlugin(...params);
}

module.exports.SFCPlugin = SFCPlugin;