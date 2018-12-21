# yyl-os SDK
```
const extOs = require('yyl-os');
```

## extOs.rm()
```
/**
 * @param  {String} iPath 文件绝对路径
 * @return {Promsie}
 */
extOs.rm(iPath)
```

## extOs.openBrowser()
```
/**
 * @param  {String} address 网页地址
 * @return {Promsie}
 */
extOs.openBrowser(address)
```

## extOs.runCMD()
```
/**
 * @param  {String}  str        cmd 命令
 * @param  {String}  path       执行命令的目录
 * @param  {Boolean} showOutput 显示日志
 * @return {Promsie} newWindow  新窗口打开
 */
extOs.runCMD(str, path, showOutput, newWindow)
```

## extOs.runSpawn()
```
/**
 * @param  {String}  str        cmd 命令
 * @param  {String}  path       执行命令的目录
 * @return {Promsie} newWindow  新窗口打开
 */
extOs.runSpawn(str, path, showOutput)
```

## extOs.openPath()
```
/**
 * @param  {String} address 文件路径
 * @return {Promsie}
 */
extOs.openPath(address)
```

## extOs.checkPort()
```
/**
 * 检查 端口是否可用
 * @param  {Number}  port 端口号
 * @return {Promsie}
 */
extOs.checkPort(port)
```

## extOs.IS_WINDOWS
```
// 是否属于 win 系统
extOs.IS_WINDOWS
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


