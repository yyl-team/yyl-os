const extOs = require('../lib/os.js')
const path = require('path')

const iPkg = path.join(__dirname, './case/package-from-github/package.json')
extOs.installPackage(iPkg, { production: true })
