const extOs = require('../lib/os.js')
const path = require('path')

extOs.runExec({ cmd: 'yarn -v' }).then((r) => {
  console.log('vvv', r)
})
