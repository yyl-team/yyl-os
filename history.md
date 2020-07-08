# 版本信息
## 0.11.2 (2020-07-08)
* fix: 修复 `extOs.openBrowser` 在操作 带 [&] url 时会报错问题
## 0.11.1 (2020-04-09)
* fix: 修复 `extOs.installPacakge` yarn 模式下执行不成功问题
## 0.11.0 (2020-04-09)
* feat: 新增 `extOs.getYarnVersion()` 方法
* feat: 新增 `extOs.installPackage(pkgPath, op)` `op.useYarn` 参数
* feat: 新增 `extOs.installNodeModules(plugins, basePath, useYarn)` `useYarn` 参数
* feat: 补充 `eslnit`, `prettier`

## 0.10.3 (2020-02-10)
* feat: 让 `extOs.runCMD()` 运行出错时会抛出对应
## 0.10.2 (2019-09-25)
* feat: `extOs.runCMD()` 新增 运行目录校验
* feat: `extOs.runSpawn()` 新增 运行目录校验
* feat: 补充 d.ts 注释

## 0.10.1 (2019-07-31)
* feat: 新增 `extOs.installPackage(pkgPath, op)` `op.loglevel` 参数

## 0.9.1(2019-07-23)
* fix: 修复 `extOs.installPackage(pkgPath, op)` 遇到 `npm install tj/react-click-outside` 会报错问题

## 0.9.0(2019-07-12)
* feat: 新增 `extOs.installPackage(pkgPath, op)` op.production 参数

## 0.8.3(2019-07-12)
* fix: 修复 `extOs.installNodeModule()` 会出现 warning 问题

## 0.8.2(2019-07-11)
* fix: 修复 `extOs.installNodeModule()` 会出现 warning 问题

## 0.8.1(2019-06-02)
* fix: 修复 linux 下 `extOs.getChromeVersion()` 获取不了的 bug 

## 0.8.0(2019-06-02)
* feat: 新增 `extOs.getChromeVersion()` 
* feat: 新增 `extOs.getJavaVersion()` 

## 0.7.3(2019-05-19)
* feat: `extOs.installPackage(pkgPath)` 改为 只检查 `dependencies` 内容
## 0.7.2(2019-05-17)
* fix: `extOs.installNodeModules(plugins, basePath)` bugfix

## 0.7.1
* feat: 新增 `extOs.runSpawn(cmd, iEnv, iPath) 方法
* todo: 已知问题 extOs.runSpawn 没有返回值

## 0.7.0
* feat: 新增 `extOs.runCMD(cmd, iEnv, iPath)` 方法

## 0.6.1
* feat: 新增 `extOs.installPackage(pkgPath)` 方法

## 0.6.0
* feat: 新增 `extOs.installNodeModules(plugins, basePath)` 方法
* feat: 新增 types 文件

## 0.5.0
* feat: 新增 `extOs.IS_WINDOWS_7`;

## 0.4.0
* feat: 新增 `extOs.clip(str)`

## 0.3.0
* feat: 新增 `extOs.runCMD().then((msg) => {})` 返回值

## 0.2.0
* feat: 新增 `extOs.checkPort(port)`
* feat: 新增 `extOs.IS_WINDOWS`
* feat: 新增 `extOs.IS_LINUX`
* feat: 新增 `extOs.LOCAL_IP`

## 0.1.0
* feat: 诞生
