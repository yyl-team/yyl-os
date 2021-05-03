const extOs = require('../lib/os.js')
const path = require('path')

extOs.runSpawn('yarn  -v', __dirname, (d) => {
  console.log('zzz', d.toString())
})
