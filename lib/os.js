const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const util = require('yyl-util');

const IS_WINDOWS = process.platform == 'win32';
const IS_LINUX = process.platform === 'linux';
const IS_MAC = process.platform === 'darwin';
const IS_WINDOWS_7 = IS_WINDOWS && /^6\.1\.\d+$/.test(os.release());

const extOs = {
  IS_WINDOWS,
  IS_LINUX,
  IS_MAC,
  IS_WINDOWS_7,
  // 本机 ip地址
  LOCAL_IP: (function() {
    var ipObj = os.networkInterfaces();
    var ipArr;
    for (var key in ipObj) {
      if (ipObj.hasOwnProperty(key)) {
        ipArr = ipObj[key];
        for (var fip, i = 0, len = ipArr.length; i < len; i++) {
          fip = ipArr[i];
          if (fip.family.toLowerCase() == 'ipv4' && !fip.internal) {
            return fip.address;
          }
        }
      }
    }
    return '127.0.0.1';
  })(),

  // 复制内容到剪贴板
  async clip(str) {
    if (IS_MAC) {
      await extOs.runCMD(`echo ${str} | tr -d '\n' | pbcopy`);
    } else if (IS_WINDOWS) {
      await extOs.runCMD(`echo|set /p=${str}|clip`);
    }
  },

  /**
   * 检查端口是否可用
   * @param  {Number}   port         需要检查的端口
   * @param  {boolean}  canUse       是否可用
   * @return {Promise}  p(canUse)    promise 对象
   */
  checkPort(port) {
    return new Promise((done) => {
      const server = net.createServer().listen(port);
      server.on('listening', () => { // 执行这块代码说明端口未被占用
        server.close(); // 关闭服务
        done(true);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') { // 端口已经被使用
          done(false);
        }
      });
    });
  },

  rm(iPath) {
    if (!fs.existsSync(iPath)) {
      return Promise.resolve();
    }

    let cmd = '';
    let rPath = iPath.replace(/ /g, '\\ ');

    if (IS_WINDOWS) {
      if (fs.statSync(iPath).isDirectory()) {
        cmd = `rd /s /q ${rPath}`;
      } else {
        cmd = `del ${rPath}`;
      }
    } else {
      cmd = `rm -rf ${rPath}`;
    }
    return extOs.runCMD(cmd);
  },

  openBrowser(address) {
    if (/^[/]{2}/.test(address)) {
      address = `http:${address}`;
    }
    if (IS_WINDOWS) {
      return extOs.runCMD(`start ${address}`);
    } else if (IS_LINUX) {
      return Promise.resolve();
    } else {
      return extOs.runCMD(`open ${address}`);
    }
  },

  runCMD: function(str, iEnv, iPath, showOutput, newWindow) {
    const myCmd = require('child_process').exec;
    const runner = (next, reject) => {
      if (typeof iEnv === 'string') { // (str, iPath, showOutput, newWindow)
        newWindow = showOutput;
        showOutput = iPath;
        iPath = iEnv;
        iEnv = null;
      }
      if (showOutput === undefined) {
        showOutput = true;
      }
      if (!str) {
        return reject('没任何 cmd 操作');
      }
      if (!/Array/.test(Object.prototype.toString.call(str))) {
        str = [str];
      }

      let iCmd = str.join(' && ');

      if (newWindow) {
        if (IS_WINDOWS) {
          iCmd = `cmd /k start cmd /k ${iCmd}`;
        } else if (IS_LINUX) {
          iCmd = `${iCmd}`;
        } else {
          iCmd = `osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'delay 0.2' -e 'tell application "Terminal" to do script "cd ${iPath} && ${iCmd}" in selected tab of the front window'`;
        }
      }

      const child = myCmd(iCmd, {
        maxBuffer: 2000 * 1024,
        cwd: iPath || '',
        env: iEnv
      }, (err, stdout) => {
        if (err) {
          if (showOutput) {
            console.log('cmd运行 出错');
            console.log(err.stack);
          }
          reject('cmd运行 出错');
        } else {
          next(stdout);
        }
      });

      child.stdout.setEncoding('utf8');

      if (showOutput) {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
      }

      if (newWindow && IS_WINDOWS) {
        next();
      }
    };
    return new Promise(runner);
  },
  /**
   * 运行 单行 cmd
   * @param  {String}       str             cmd执行语句 or 数组
   * @param  {funciton}     callback(error) 回调函数
   *                        - error         错误信息
   * @return {Void}
   */
  runSpawn: function(ctx, iEnv, iPath, showOutput) {
    const iSpawn = require('child_process').spawn;
    const runner = (next, reject) => {
      if (typeof iEnv === 'string') { // (str, iPath, showOutput, newWindow)
        showOutput = iPath;
        iPath = iEnv;
        iEnv = null;
      }
      let ops = '';
      let hand = '';
      const cwd = iPath || process.cwd();

      if (IS_WINDOWS) {
        hand = 'cmd.exe';
        ops = ['/s', '/c', ctx];
      } else {
        hand = '/bin/sh';
        ops = ['-c', ctx];
      }

      const child = iSpawn(hand, ops, {
        cwd: cwd,
        silent: showOutput ? true : false,
        stdio: [0, 1, 2],
        env: iEnv
      });
      child.on('exit', (err) => {
        if (err) {
          reject(err);
        } else {
          next();
        }
      });
    };

    return new Promise(runner);
  },
  /**
   * 打开文件所在位置
   */
  openPath: function(iPath) {
    if (IS_WINDOWS) {
      return extOs.runCMD(`start ${iPath.replace(/\//g, '\\')}`,  __dirname);
    } else if (IS_LINUX) {
      return Promise.resolve();
    } else {
      return extOs.runCMD(`open ${iPath}`);
    }
  },

  /**
   * 安装 node 接件
   */
  async installNodeModules(plugins, basePath) {
    if (!plugins || !plugins.length) {
      return;
    }

    if (!basePath) {
      throw 'install node_modules fail, basePath is not set';
    }

    if (!fs.existsSync(basePath)) {
      throw `install node_modules fail, basePath is not exists: ${basePath}`;
    }
    const iPkgPath = path.join(basePath, './package.json');
    const nodeModulePath = path.join(basePath, 'node_modules');
    if (!fs.existsSync(iPkgPath)) {
      fs.writeFileSync(iPkgPath, JSON.stringify({
        description: 'none',
        repository: 'none',
        license: 'ISC'
      }, null, 2));
    } else {
      const iPkg = require(iPkgPath);
      let changeed = false;
      
      if (!iPkg.description) {
        iPkg.description = 'none';
        changeed = true;
      }

      if (!iPkg.repository) {
        iPkg.repository = 'none';
        changeed = true;
      }

      if (!iPkg.license) {
        iPkg.license = 'ISC';
        changeed = true;
      }
      if (changeed) {
        fs.writeFileSync(iPkgPath, JSON.stringify(iPkg, null, 2));
      }
    }

    if (!fs.existsSync(nodeModulePath)) {
      fs.mkdirSync(nodeModulePath);
    }

    const installLists = [];

    plugins.forEach((str) => {
      let iDir = '';
      let iVer = '';
      const pathArr = str.split(/[\\/]+/);
      let pluginPath = '';
      let pluginName = '';
      if (pathArr.length > 1) {
        pluginName = pathArr.pop();
        pluginPath = pathArr.join('/');
      } else {
        pluginName = pathArr[0];
      }

      if (~pluginName.indexOf('@')) {
        iDir = pluginName.split('@')[0];
        iVer = pluginName.split('@')[1];
      } else {
        iDir = pluginName;
      }
      let iBasePath = path.join(nodeModulePath, pluginPath, iDir);
      let iPkgPath = path.join(iBasePath, 'package.json');
      let iPkg;
      if (fs.existsSync(iBasePath) && fs.existsSync(iPkgPath)) {
        if (iVer) {
          iPkg = require(iPkgPath);
          if (iPkg.version != iVer) {
            installLists.push(str);
          }
        }
      } else {
        installLists.push(str);
      }
    });

    if (installLists.length) {
      const cmd = `npm install ${installLists.join(' ')} --loglevel http`;
      return await extOs.runCMD(cmd, basePath);
    } else {
      return;
    }
  },
  async installPackage(pkgPath) {
    let bPath = path.dirname(pkgPath);

    const nodeModulePath = util.path.join(bPath, 'node_modules');
    const nodePathExists = fs.existsSync(nodeModulePath);
    const getModuleVersion = function (name) {
      const modVerPath = util.path.join(nodeModulePath, name, 'package.json');
      let r = '0';
      if (!fs.existsSync(modVerPath)) {
        return r;
      }

      try {
        const modPkg = require(modVerPath);
        r = modPkg.version;
      } catch (er) {}
      return r;
    };
    let needInstall = false;
    if (fs.existsSync(pkgPath)) {
      let iPkg = {};
      try {
        iPkg = require(pkgPath);
      } catch (er) {}

      let checkMap = {};
      if (iPkg.dependencies) {
        checkMap = Object.assign(checkMap, iPkg.dependencies);
      }

      if (checkMap) {
        Object.keys(checkMap).some((key) => {
          if (
            !nodePathExists ||
            !util.matchVersion(checkMap[key], getModuleVersion(key))
          ) {
            needInstall = true;
            return true;
          }
        });
      }
    }

    if (needInstall) {
      return await extOs.runCMD('npm install --loglevel http', bPath);
    }
  },
  async getChromeVersion() {
    const self = this;
    let verStr = '';
    let cmd = '';
    let verReg = null;

    if (IS_MAC) {
      cmd = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version';
      verReg = /^[\w\W]*Chrome\s+([0-9._]+)[\w\W]*$/i;
    } else if (IS_WINDOWS) {
      cmd = 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version';
      verReg = /^[\w\W]*REG_SZ\s*([0-9._]+)[\w\W]*$/i;
    } else if (IS_LINUX) {
      cmd = 'google-chrome --version';
      verReg = /^[\w\W]*Chrome\s+([0-9._]+)[\w\W]*$/i;
    }
    if (cmd) {
      try {
        verStr = await self.runCMD(cmd, __dirname, false);
      } catch (er) {}
      if (verStr && verStr.match(verReg)) {
        return verStr.replace(verReg, '$1');
      } else {
        return;
      }
    } else {
      return;
    }
  },
  getJavaVersion() {
    let verStr = '';
    const reg = /^[\w\W]*version "([0-9._]+)"[\w\W]*$/;
    return new Promise((next) => {
      const child = require('child_process').spawn('java', ['-version']);
      child.stderr.on('data', (data) => {
        verStr = data.toString();
        if (verStr && verStr.match(reg)) {
          next(verStr.replace(reg, '$1'));
        } else {
          next();
        }
      });
      child.on('error', () => {
        next();
      });
    });
  }
};

module.exports = extOs;
