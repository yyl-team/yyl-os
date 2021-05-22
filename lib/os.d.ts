declare const os:Os;

interface InstallPKGOptions {
  production: boolean
  useYarn: boolean
  loglevel: 'silent' | 'info' | 'http' | 'warn' | 'verbose' | 'silly',
  showOutput?: boolean | ((msg: Buffer) => void)
}

/** 运行脚本 - 配置 */
interface RunExecOption {
  cmd: string
  cwd?: string
}

interface Os {
  /** 是否属于 windows */
  IS_WINDOWS: boolean;
  /** 是否属于 linux */
  IS_LINUX: boolean;
  /** 是否属于 macOs */
  IS_MAC: boolean;
  /** 是否属于 windows 7 */
  IS_WINDOWS_7: boolean;
  /** 本地 ip */
  LOCAL_IP: string;
  /**
   * 复制字符串到剪贴板
   * @param str 待复制字符串
   */
  clip(str: string): Promise<any>;
  /**
   * 检查端口是否可用
   * @param port 端口
   */
  checkPort(port: number): Promise<any>;
  /**
   * 移除目录
   * @param path 待移除目录
   */
  rm(path: string): Promise<any>;
  /**
   * 用浏览器打开
   * @param path 地址
   */
  openBrowser(path: string): Promise<any>;
  /**
   * 打开文件所在目录
   * @param path 地址
   */
  openPath(path: string): Promise<any>;
  /**
   * 运行cmd 命令
   * @param cmd 命令
   * @param path 运行目录
   * @param showOutput 是否输出日志
   * @param newWindow 是否新窗口打开
   */
  runCMD(cmd: string, path?:string, showOutput?: boolean, newWindow?: boolean): Promise<any>;
  /**
   * 运行cmd 命令
   * @param cmd 命令
   * @param iEnv 环境变量
   * @param path 运行目录
   * @param showOutput 是否输出日志
   * @param newWindow 是否新窗口打开
   */
  runCMD(cmd: string, iEnv:object, path?:string, showOutput?: boolean, newWindow?: boolean): Promise<any>;
  /**
   * 运行cmd 命令
   * @param cmd 命令
   * @param path 运行目录
   * @param showOutput 是否输出日志
   */
  runSpawn(cmd: string, path?:string, showOutput?: boolean | ((msg: Buffer) => void)): Promise<any>;
  /**
   * 安装 node_modules 插件
   * @param plugins 插件列表
   * @param basePath 安装地址
   * @param showOutput 是否输出日志
   */
  installNodeModules(plugins: string[], basePath: string, useYarn: boolean, showOutput?: boolean | ((msg: Buffer) => void)): Promise<any>;
  /**
   * 安装插件
   * @param pkgPath 插件地址
   * @param op 选项
   */
  installPackage(pkgPath: string, op?: InstallPKGOptions): Promise<any>;
  /** 获取 chrome 版本 */
  getChromeVersion(): Promise<string|undefined>;
  /** 获取 yarn 版本 */
  getYarnVersion(): Promise<string|undefined>;
  /** 获取 java 版本 */
  getJavaVersion(): Promise<string|undefined>;
  /** 运行脚本 */
  runExec(op: RunExecOption): Promise<string|undefined>;
}
export = os;