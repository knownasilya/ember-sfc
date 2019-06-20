const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const fs = require('fs');
const dedent = require('dedent');

const templateRegex = /<\s*template[^>]*>([\s\S]+?)<\s*\/\s*template>/gm;

class SFCPlugin extends Plugin {
  constructor(inputNodes, options = {}) {
    super(inputNodes, options);

    this.fileMatchers = options.globs || ['**/*.ember'];
    this.topDir = options.name;
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
          if (!file) {
            return;
          }
          let inputContent = fs.readFileSync(file, { encoding: 'UTF-8' });
          let [fullTemplate, templateContent] = templateRegex.exec(inputContent);
          console.log(file);
          let topDir = file.includes('/dummy/') ? 'dummy' : this.topDir;
          let [, fileBasePath] = file.split(`/${topDir}/`);
          if (!fileBasePath) {
            console.log(`Invalid split on "${file}" with split point "${topDir}". This is probably a bug.`);
            return;
          }
          let componentBasePath = fileBasePath.replace('.ember', '/');
          let templatePath = componentBasePath + 'template.hbs';
          let componentContent = inputContent.replace(fullTemplate, '');
          let componentPath = componentBasePath + 'component.js';
          fs.mkdirSync(`${this.outputPath}/${topDir}/${componentBasePath}`, { recursive: true });
          fs.writeFileSync(`${this.outputPath}/${topDir}/${templatePath}`, dedent`${templateContent}`);
          fs.writeFileSync(`${this.outputPath}/${topDir}/${componentPath}`, componentContent);
        });
    });
  }
}

module.exports = function sfcPlugin(...params) {
  return new SFCPlugin(...params);
}

module.exports.SFCPlugin = SFCPlugin;