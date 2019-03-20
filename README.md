# yyl - os SDK 
```
const extOs = require('yyl-os');
```

## extOs.rm()
```
/**
 * @param  {String}          iPath 文件绝对路径
 * @return {Promise<string>} log   cmd log
 */
extOs.rm(iPath)
```

## extOs.openBrowser()
```
/**
 * @param  {String}          address 网页地址
 * @return {Promise<string>} log     cmd log
 */
extOs.openBrowser(address)
```

## extOs.runCMD()
```
/**
 * @param  {String}          str         cmd 命令
 * @param  {String}          path        执行命令的目录
 * @param  {Boolean}         showOutput  显示日志
 * @param  {Boolean}         newWindow   新窗口打开
 * @return {Promise<string>} log         cmd log
 */
extOs.runCMD(str, path, showOutput, newWindow)
```

## extOs.runSpawn()
```
/**
 * @param  {String}          str         cmd 命令
 * @param  {String}          path        执行命令的目录
 * @param  {Boolean}         showOutput  是否显示输出
 * @return {Promise<string>} log         cmd log
 */
extOs.runSpawn(str, path, showOutput)
```

## extOs.openPath()
```
/**
 * @param  {String}          address  文件路径
 * @return {Promise<string>} log      cmd log
 */
extOs.openPath(address)
```

## extOs.checkPort()
```
/**
 * 检查 端口是否可用
 * @param  {Number}           port    端口号
 * @return {Promise<boolean>} canUse  端口是否可用
 */
extOs.checkPort(port)
```

## extOs.IS_WINDOWS
```
// 是否属于 win 系统
extOs.IS_WINDOWS
```

## extOs.IS_WINDOWS_7
```
// 是否属于 win7 系统
extOs.IS_WINDOWS_7
```

## extOs.IS_LINUX
```
// 是否属于 linux 系统
extOs.IS_LINUX
```

## extOs.LOCAL_IP
```
// 本地ip 地址
extOs.LOCAL_IP
```
## extOs.clip(str)
```
/**
 * 复制 字符串到系统剪贴板(支持 windows 和 macos)
 * @param  {String}          str      需要复制的内容
 * @return {Promise<string>} log      cmd log
 */
extOs.clip(str)
```
