const extOs = require('../lib/os.js');

extOs.getChromeVersion().then((v) => {
  console.log(`chrome[${v}]`);
});
extOs.getJavaVersion().then((v) => {
  console.log(`java[${v}]`);
});