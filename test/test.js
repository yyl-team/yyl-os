const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const extFs = require('yyl-fs');
const extOs = require('../index.js');

const TEST_CTRL = {
  RM: true,
  OPEN_BROWSER: true,
  RUN_CMD: true,
  RUN_SPAWN: true,
  OPEN_PATH: true
};

const FRAG_PATH = path.join(__dirname, '__frag');
const fn = {
  frag: {
    build() {
      if (fs.existsSync(FRAG_PATH)) {
        return extFs.removeFiles(FRAG_PATH);
      } else {
        return extFs.mkdirSync(FRAG_PATH);
      }
    },
    destroy() {
      return extFs.removeFiles(FRAG_PATH, true);
    },
    here(f, done) {
      fn.frag.build().then(() => {
        const next = () => {
          fn.frag.destroy().then(() => {
            done();
          });
        };

        f(next);
      });
    }
  },
  mkFilesSync: function(list) {
    list.forEach((iPath) => {
      extFs.mkdirSync(path.dirname(iPath));
      fs.writeFileSync(iPath, '');
    });
  }
};

if (TEST_CTRL.RM) {
  describe('extOs.rm() test', () => {
    it('rm director test', function(done) {
      this.timeout(0);
      fn.frag.here((next) => {
        const testPath = path.join(FRAG_PATH, 'name/to/path');
        extFs.mkdirSync(testPath);
        expect(fs.existsSync(testPath)).to.equal(true);

        extOs.rm(FRAG_PATH).then(() => {
          expect(fs.existsSync(FRAG_PATH)).to.equal(false);
          next();
        });
      }, done);
    });

    it('rm file test', function(done) {
      this.timeout(0);
      fn.frag.here((next) => {
        const testFile = path.join(FRAG_PATH, 'name/to/path/1.js');
        fn.mkFilesSync([testFile]);
        expect(fs.existsSync(testFile)).to.equal(true);

        extOs.rm(testFile).then(() => {
          expect(fs.existsSync(testFile)).to.equal(false);
          expect(fs.existsSync(path.dirname(testFile))).to.equal(true);
          next();
        }).catch((er) => {
          throw new Error(er);
        });
      }, done);
    });
  });
}

if (TEST_CTRL.OPEN_BROWSER) {
  describe('extOs.openBrowser() test', () => {
    it('extOs.openBrowser("//www.yy.com") test', function(done) {
      this.timeout(0);
      extOs.openBrowser('//www.yy.com').then(() =>{
        done();
      }).catch((er) => {
        throw new Error(er);
      });
    });

    it('extOs.openBrowser("http://www.yy.com")', function(done) {
      this.timeout(0);
      extOs.openBrowser('http://www.yy.com').then(() =>{
        done();
      }).catch((er) => {
        throw new Error(er);
      });
    });
  });
}

if (TEST_CTRL.OPEN_PATH) {
  describe('extOs.openPath() test', () => {
    it(`extOs.openPath('${__dirname}')`, function(done) {
      this.timeout(0);
      extOs.openPath(__dirname).then(() =>{
        done();
      }).catch((er) => {
        throw new Error(er);
      });
    });
  });
}

if (TEST_CTRL.RUN_CMD) {
  describe('extOs.runCMD() test', () => {
    const cmd = 'git clone https://github.com/jackness1208/yyl-os.git';
    it(`extOs.runCMD(${cmd}, ${FRAG_PATH})`, function(done) {
      this.timeout(0);
      fn.frag.here((next) => {
        extOs.runCMD(cmd, FRAG_PATH).then(() =>{
          expect(fs.existsSync(path.join(FRAG_PATH, 'yyl-os'))).to.equal(true);
          next();
        }).catch((er) => {
          throw new Error(er);
        });
      }, done);
    });
  });
}

if (TEST_CTRL.RUN_SPAWN) {
  describe('extOs.runSpawn() test', () => {
    const cmd = 'git clone https://github.com/jackness1208/yyl-os.git';
    it(`extOs.runSpawn(${cmd}, ${FRAG_PATH})`, function(done) {
      this.timeout(0);
      fn.frag.here((next) => {
        extOs.runSpawn(cmd, FRAG_PATH).then(() =>{
          expect(fs.existsSync(path.join(FRAG_PATH, 'yyl-os'))).to.equal(true);
          next();
        }).catch((er) => {
          throw new Error(er);
        });
      }, done);
    });
  });
}
