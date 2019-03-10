const fs = require('fs');
const net = require('net');
const os = require('os');

const IS_WINDOWS = process.platform == 'win32';
const IS_LINUX = process.platform === 'linux';
const IS_MAC = process.platform === 'darwin';

const extOs = {
  IS_WINDOWS,
  IS_LINUX,
  IS_MAC,

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
  /**
   * 运行 cmd
   * @param  {String|Array} str             cmd执行语句 or 数组
   * @param  {funciton}     callback(error) 回调函数
   *                        - error         错误信息
   * @param  {String}       path            运行目录
   * @param  {Boolean}      showOutput      是否显示运行log
   * @param  {Boolean}      newWindow       是否新开命令窗口运行
   * @return {Void}
   */
  runCMD: function(str, path, showOutput, newWindow) {
    const myCmd = require('child_process').exec;
    const runner = (next, reject) => {
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
          iCmd = `osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'delay 0.2' -e 'tell application "Terminal" to do script "cd ${path} && ${iCmd}" in selected tab of the front window'`;
        }
      }

      const child = myCmd(iCmd, {
        maxBuffer: 2000 * 1024,
        cwd: path || ''
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
  runSpawn: function(ctx, iPath, showOutput) {
    const iSpawn = require('child_process').spawn;
    const runner = (next, reject) => {
      let ops = '';
      let hand = '';
      const cwd = iPath || process.cwd();
      const PROJECT_PATH = process.cwd();

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
        stdio: [0, 1, 2]
      });
      child.on('exit', (err) => {
        process.chdir(PROJECT_PATH);
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
  }
};

module.exports = extOs;