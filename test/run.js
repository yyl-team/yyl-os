const extOs = require('../index.js');


extOs.runCMD('dir', __dirname, false).then((r) => {
  console.log('================')
  console.log(r.length)
  console.log(r)
  console.log('================')
});

