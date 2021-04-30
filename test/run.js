const extOs = require('../lib/os.js')
const path = require('path')

const iPkg = path.join(__dirname, './case/package-from-github/package.json')
const pkg = require(iPkg)
console.log('start', Object.keys(pkg.dependencies))
extOs
  .installNodeModules(Object.keys(pkg.dependencies), path.dirname(iPkg), true)
  .then((rs) => {
    console.log('========')
    if (rs) {
      console.log(rs.toString())
    }
    console.log('========')
  })
