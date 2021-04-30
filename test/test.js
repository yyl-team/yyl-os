const expect = require('chai').expect
const path = require('path')
const fs = require('fs')
const extFs = require('yyl-fs')
const util = require('yyl-util')
const extOs = require('../')
const net = require('net')

const TEST_CTRL = {
  RM: true,
  OPEN_BROWSER: true,
  RUN_CMD: true,
  RUN_SPAWN: true,
  OPEN_PATH: true,
  CHECK_PORT: true,
  INSTALL_NODE_MODULES: true,
  INSTALL_PACKAGE: true,
  GET_CHROME_VERSION: true,
  GET_JAVA_VERSION: true,
  GET_YARN_VERSION: true,
}

const FRAG_PATH = path.join(__dirname, '__frag')
const fn = {
  frag: {
    build() {
      if (fs.existsSync(FRAG_PATH)) {
        return extFs.removeFiles(FRAG_PATH)
      } else {
        return extFs.mkdirSync(FRAG_PATH)
      }
    },
    destroy() {
      return extFs.removeFiles(FRAG_PATH, true)
    },
    here(f, done) {
      fn.frag.build().then(() => {
        const next = () => {
          fn.frag.destroy().then(() => {
            done()
          })
        }

        f(next)
      })
    },
  },
  mkFilesSync: function (list) {
    list.forEach((iPath) => {
      extFs.mkdirSync(path.dirname(iPath))
      fs.writeFileSync(iPath, '')
    })
  },
  makeAsync(fn) {
    return function (done) {
      fn.then(() => {
        done()
      })
    }
  },
  makeAwait(fn) {
    return new Promise(fn)
  },
}

if (TEST_CTRL.RM) {
  describe('extOs.rm() test', () => {
    it('rm director test', function (done) {
      this.timeout(0)
      fn.frag.here((next) => {
        const testPath = path.join(FRAG_PATH, 'name/to/path')
        extFs.mkdirSync(testPath)
        expect(fs.existsSync(testPath)).to.equal(true)

        extOs.rm(FRAG_PATH).then(() => {
          expect(fs.existsSync(FRAG_PATH)).to.equal(false)
          next()
        })
      }, done)
    })

    it('rm file test', function (done) {
      this.timeout(0)
      fn.frag.here((next) => {
        const testFile = path.join(FRAG_PATH, 'name/to/path/1.js')
        fn.mkFilesSync([testFile])
        expect(fs.existsSync(testFile)).to.equal(true)

        extOs
          .rm(testFile)
          .then(() => {
            expect(fs.existsSync(testFile)).to.equal(false)
            expect(fs.existsSync(path.dirname(testFile))).to.equal(true)
            next()
          })
          .catch((er) => {
            throw new Error(er)
          })
      }, done)
    })
  })
}

if (TEST_CTRL.OPEN_BROWSER) {
  describe('extOs.openBrowser() test', () => {
    it('extOs.openBrowser("//www.yy.com") test', function (done) {
      this.timeout(0)
      extOs
        .openBrowser('//www.yy.com')
        .then(() => {
          done()
        })
        .catch((er) => {
          throw new Error(er)
        })
    })

    it('extOs.openBrowser("http://www.yy.com")', function (done) {
      this.timeout(0)
      extOs
        .openBrowser('http://www.yy.com')
        .then(() => {
          done()
        })
        .catch((er) => {
          throw new Error(er)
        })
    })

    it('extOs.openBrowser("http://webtest.yy.com/wxservice_reservation_page/?type=reservation&popupId=1&bizScene=1jBGNBrSsfyFecUrevwWcRShm7iwt") test', function (done) {
      this.timeout(0)
      extOs
        .openBrowser(
          'http://webtest.yy.com/wxservice_reservation_page/?type=reservation&popupId=1&bizScene=1jBGNBrSsfyFecUrevwWcRShm7iwt'
        )
        .then(() => {
          done()
        })
        .catch((er) => {
          throw new Error(er)
        })
    })
  })
}

if (TEST_CTRL.OPEN_PATH) {
  describe('extOs.openPath() test', () => {
    it(`extOs.openPath('${__dirname}')`, function (done) {
      this.timeout(0)
      extOs
        .openPath(__dirname)
        .then(() => {
          done()
        })
        .catch((er) => {
          throw new Error(er)
        })
    })
  })
}

if (TEST_CTRL.RUN_CMD) {
  describe('extOs.runCMD(cmd, iPath) test', () => {
    const cmd = 'git clone https://github.com/yyl-team/yyl-os.git'
    it(`extOs.runCMD(${cmd}, ${FRAG_PATH})`, function (done) {
      this.timeout(0)
      fn.frag.here((next) => {
        extOs
          .runCMD(cmd, FRAG_PATH)
          .then((msg) => {
            expect(fs.existsSync(path.join(FRAG_PATH, 'yyl-os'))).to.equal(true)
            expect(typeof msg).to.equal('string')
            next()
          })
          .catch((er) => {
            throw new Error(er)
          })
      }, done)
    })
  })

  describe('extOs.runCMD(cmd, iEnv, iPath) test', () => {
    const cmd = 'node runCMD.test.js'
    const iPath = path.join(__dirname, './')
    const iEnv = {
      mode: 'dev',
    }
    it(`extOs.runCMD(${cmd}, ${JSON.stringify(
      iEnv
    )}, ${iPath})`, function (done) {
      this.timeout(0)
      extOs
        .runCMD(cmd, iEnv, iPath)
        .then((r) => {
          const result = r.replace(/[\r\n]+/g, '')
          expect(result).to.equal(iEnv.mode)
          done()
        })
        .catch((er) => {
          throw new Error(er)
        })
    })
  })
}

if (TEST_CTRL.RUN_SPAWN) {
  describe('extOs.runSpawn() test', () => {
    const cmd = 'git clone https://github.com/yyl-team/yyl-os.git'
    it(`extOs.runSpawn(${cmd}, ${FRAG_PATH})`, function (done) {
      this.timeout(0)
      fn.frag.here((next) => {
        extOs
          .runSpawn(cmd, FRAG_PATH)
          .then(() => {
            expect(fs.existsSync(path.join(FRAG_PATH, 'yyl-os'))).to.equal(true)
            next()
          })
          .catch((er) => {
            throw new Error(er)
          })
      }, done)
    })
  })
}

if (TEST_CTRL.CHECK_PORT) {
  describe('extOs.checkPort(port) test', () => {
    it('useage test', (done) => {
      const server = net.createServer().listen(1234)
      server.on('listening', async () => {
        let canUse = await extOs.checkPort(1234)
        expect(canUse).to.equal(false)
        server.close()

        canUse = await extOs.checkPort(4321)
        expect(canUse).to.equal(true)
        done()
      })
    })
  })
}

if (TEST_CTRL.INSTALL_NODE_MODULES) {
  describe('extOs.installNodeModules(plugins, basePath)', () => {
    it(
      'usage test',
      util.makeAsync(async () => {
        await fn.frag.build()

        // run
        const testPlugins = ['yyl-flexlayout', 'yyl-os@0.4.0']
        await extOs.installNodeModules(testPlugins, FRAG_PATH)

        // check
        const pkgPath = path.join(FRAG_PATH, 'package.json')
        const p1Path = path.join(FRAG_PATH, 'node_modules/yyl-flexlayout')
        const p2Path = path.join(FRAG_PATH, 'node_modules/yyl-os')
        ;[pkgPath, p1Path, p2Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(true)
        })
        const p2PkgPath = path.join(p2Path, 'package.json')
        const ver = require(p2PkgPath).version

        expect(ver).to.equal('0.4.0')

        // destroy
        await fn.frag.destroy()
      }, true)
    )
    it(
      'yarn test',
      util.makeAsync(async () => {
        await fn.frag.build()

        // run
        const testPlugins = ['yyl-flexlayout', 'yyl-os@0.4.0']
        await extOs.installNodeModules(testPlugins, FRAG_PATH, true)

        // check
        const pkgPath = path.join(FRAG_PATH, 'package.json')
        const p1Path = path.join(FRAG_PATH, 'node_modules/yyl-flexlayout')
        const p2Path = path.join(FRAG_PATH, 'node_modules/yyl-os')
        ;[pkgPath, p1Path, p2Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(true)
        })
        const p2PkgPath = path.join(p2Path, 'package.json')
        const ver = require(p2PkgPath).version

        expect(ver).to.equal('0.4.0')

        // destroy
        await fn.frag.destroy()
      }, true)
    )
  })
}

if (TEST_CTRL.INSTALL_PACKAGE) {
  describe('extOs.installPackage(pkgPath)', () => {
    it(
      'extOs.installPackage(pkgPath)',
      util.makeAsync(async () => {
        // start
        await fn.frag.build()

        // init
        const pkgCnt = {
          dependencies: {
            'yyl-flexlayout': '^1.6.1',
          },
          devDependencies: {
            'yyl-os': '0.4.0',
          },
        }
        const pkgPath = path.join(FRAG_PATH, 'package.json')
        fs.writeFileSync(pkgPath, JSON.stringify(pkgCnt, null, 2))

        // run
        await extOs.installPackage(pkgPath)

        const p1Path = path.join(FRAG_PATH, 'node_modules', 'yyl-flexlayout')
        const p2Path = path.join(FRAG_PATH, 'node_modules', 'yyl-os')

        ;[p1Path, p2Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(true)
        })

        const r = await extOs.installPackage(pkgPath)
        expect(r).to.equal(undefined)

        // destroy
        await fn.frag.destroy()
      }, true)
    )

    it(
      'extOs.installPackage(pkgPath) yarn',
      util.makeAsync(async () => {
        // start
        await fn.frag.build()

        // init
        const pkgCnt = {
          dependencies: {
            'yyl-flexlayout': '^1.6.1',
          },
          devDependencies: {
            'yyl-os': '0.4.0',
          },
        }
        const pkgPath = path.join(FRAG_PATH, 'package.json')
        fs.writeFileSync(pkgPath, JSON.stringify(pkgCnt, null, 2))

        // run
        await extOs.installPackage(pkgPath, { useYarn: true })

        const p1Path = path.join(FRAG_PATH, 'node_modules', 'yyl-flexlayout')
        const p2Path = path.join(FRAG_PATH, 'node_modules', 'yyl-os')

        ;[p1Path, p2Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(true)
        })

        const r = await extOs.installPackage(pkgPath, { useYarn: true })
        expect(r).to.equal(undefined)

        // destroy
        await fn.frag.destroy()
      }, true)
    )
  })

  describe('extOs.installPackage(pkgPath, { production: true })', () => {
    it(
      'extOs.installPackage(pkgPath, { production: true })',
      util.makeAsync(async () => {
        // start
        await fn.frag.build()

        // init
        const pkgCnt = {
          dependencies: {
            'react-click-outside': 'github:tj/react-click-outside',
            'yyl-flexlayout': '^1.6.1',
          },
          devDependencies: {
            'yyl-os': '0.4.0',
          },
        }
        const pkgPath = path.join(FRAG_PATH, 'package.json')
        fs.writeFileSync(pkgPath, JSON.stringify(pkgCnt, null, 2))

        // run
        await extOs.installPackage(pkgPath, { production: true })

        const p1Path = path.join(FRAG_PATH, 'node_modules', 'yyl-flexlayout')
        const p2Path = path.join(FRAG_PATH, 'node_modules', 'yyl-os')

        ;[p1Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(true)
        })
        ;[p2Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(false)
        })

        // destroy
        await fn.frag.destroy()
      }, true)
    )

    it(
      'extOs.installPackage(pkgPath, { production: true, useYarn: true })',
      util.makeAsync(async () => {
        // start
        await fn.frag.build()

        // init
        const pkgCnt = {
          dependencies: {
            'react-click-outside': 'github:tj/react-click-outside',
            'yyl-flexlayout': '^1.6.1',
          },
          devDependencies: {
            'yyl-os': '0.4.0',
          },
        }
        const pkgPath = path.join(FRAG_PATH, 'package.json')
        fs.writeFileSync(pkgPath, JSON.stringify(pkgCnt, null, 2))

        // run
        await extOs.installPackage(pkgPath, { production: true, useYarn: true })

        const p1Path = path.join(FRAG_PATH, 'node_modules', 'yyl-flexlayout')
        const p2Path = path.join(FRAG_PATH, 'node_modules', 'yyl-os')

        ;[p1Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(true)
        })
        ;[p2Path].forEach((iPath) => {
          expect(fs.existsSync(iPath)).to.equal(false)
        })

        // destroy
        await fn.frag.destroy()
      }, true)
    )

    it(
      'test case package-from-github',
      util.makeAsync(async () => {
        const pkgPath = path.join(
          __dirname,
          './case/package-from-github/package.json'
        )
        await extOs.installPackage(pkgPath, { production: true })
      }, true)
    )
  })
}

if (TEST_CTRL.GET_CHROME_VERSION) {
  describe('extOs.getChromeVersion()', () => {
    it(
      'usage test',
      util.makeAsync(async () => {
        expect(await extOs.getChromeVersion()).not.to.equal(undefined)
      }, true)
    )
  })
}

if (TEST_CTRL.GET_JAVA_VERSION) {
  describe('extOs.getJavaVersion()', () => {
    it(
      'usage test',
      util.makeAsync(async () => {
        expect(await extOs.getJavaVersion()).to.equal(undefined)
      }, true)
    )
  })
}

if (TEST_CTRL.GET_YARN_VERSION) {
  describe('extOs.getYarnVersion()', () => {
    it(
      'usage test',
      util.makeAsync(async () => {
        expect(await extOs.getYarnVersion()).not.to.equal(undefined)
      }, true)
    )
  })
}
