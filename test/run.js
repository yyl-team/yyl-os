const extOs = require('../lib/os.js')
const path = require('path')

extOs
  .runSpawn('npm i vue@2.6.22', __dirname, (d) => {
    console.log('zzz', d.toString())
  })
  .catch((er) => {
    console.log('err!', er)
  })
