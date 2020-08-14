const YAML = require('yamljs');

const nativeObject = YAML.load('config/config.yaml');
console.log('nativeObject', nativeObject.oss.ossId);
