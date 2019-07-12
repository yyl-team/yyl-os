# 版本信息
## 0.9.0(2019-07-12)
* [EDIT] 新增 `extOs.installPackage(pkgPath, op)` op.production 参数
## 0.8.3(2019-07-12)
* [FIX] 修复 `extOs.installNodeModule()` 会出现 warning 问题

## 0.8.2(2019-07-11)
* [FIX] 修复 `extOs.installNodeModule()` 会出现 warning 问题

## 0.8.1(2019-06-02)
* [FIX] 修复 linux 下 `extOs.getChromeVersion()` 获取不了的 bug 

## 0.8.0(2019-06-02)
* [ADD] 新增 `extOs.getChromeVersion()` 
* [ADD] 新增 `extOs.getJavaVersion()` 

## 0.7.3(2019-05-19)
* [EDIT] `extOs.installPackage(pkgPath)` 改为 只检查 `dependencies` 内容
## 0.7.2(2019-05-17)
* [FIX] `extOs.installNodeModules(plugins, basePath)` bugfix

## 0.7.1
* [ADD] 新增 `extOs.runSpawn(cmd, iEnv, iPath) 方法
* [TIPS] 已知问题 extOs.runSpawn 没有返回值

## 0.7.0
* [ADD] 新增 `extOs.runCMD(cmd, iEnv, iPath)` 方法

## 0.6.1
* [ADD] 新增 `extOs.installPackage(pkgPath)` 方法

## 0.6.0
* [ADD] 新增 `extOs.installNodeModules(plugins, basePath)` 方法
* [ADD] 新增 types 文件

## 0.5.0
* [ADD] 新增 `extOs.IS_WINDOWS_7`;

## 0.4.0
* [ADD] 新增 `extOs.clip(str)`

## 0.3.0
* [EDIT] 新增 `extOs.runCMD().then((msg) => {})` 返回值

## 0.2.0
* [ADD] 新增 `extOs.checkPort(port)`
* [ADD] 新增 `extOs.IS_WINDOWS`
* [ADD] 新增 `extOs.IS_LINUX`
* [ADD] 新增 `extOs.LOCAL_IP`

## 0.1.0
* [ADD] 诞生
