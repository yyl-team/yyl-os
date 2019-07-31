declare const os:Ios;

interface IinstallPKGOptions {
  production: boolean;
  loglevel: 'silent' | 'info' | 'http' | 'warn' | 'verbose' | 'silly'
}

interface Ios {
  IS_WINDOWS: boolean;
  IS_LINUX: boolean;
  IS_MAC: boolean;
  IS_WINDOWS_7: boolean;
  LOCAL_IP: string;
  clip(str: string): Promise<any>;
  checkPort(port: number): Promise<any>;
  rm(path: string): Promise<any>;
  openBrowser(path: string): Promise<any>;
  openPath(path: string): Promise<any>;
  runCMD(cmd: string, path?:string, showOutput?: boolean, newWindow?: boolean): Promise<any>;
  runCMD(cmd: string, iEnv:object, path?:string, showOutput?: boolean, newWindow?: boolean): Promise<any>;
  runSpawn(cmd: string, path?:string, showOutput?: boolean): Promise<any>;
  installNodeModules(plugins: string[], basePath: string): Promise<any>;
  installPackage(pkgPath: string, op?: IinstallPKGOptions): Promise<any>;
  getChromeVersion(): Promise<string|undefined>;
  getJavaVersion(): Promise<string|undefined>;
}
export = os;