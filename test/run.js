const extOs = require('../lib/os.js');
extOs.runCMD('node ./runCMD.test.js', { mode: 'zz' }, __dirname, false).then((r) => {
  const result = r.replace(/[\r\n]+/, '');
  console.log(`[${result}]`);
});
