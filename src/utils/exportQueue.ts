// 导出f2监听
class ExportQueue {
  private exportMgr: any = {};
  addEvent() {
    document.addEventListener("keyup", this.keyupHandler);
  }

  removeEvent() {
    document.removeEventListener("keyup", this.keyupHandler);
  }

  keyupHandler = (e: any) => {
    if (e.code === "F2") {
      const fn = this.exportMgr[(window as any)._vue.$route.path];
      if (Array.isArray(fn)) {
        fn[fn.length - 1](false);
        return;
      }
      fn && fn(false);
    }
  };

  /**
   *
   * @param path 路由
   * @param fn 导出函数
   * @param flag 是否覆盖 true: 追加 false: 覆盖 (同一个路由下可能存在多个导出)
   */
  addQueue(path: string, fn: any, flag: boolean) {
    if (flag) {
      this.exportMgr[path] = this.exportMgr[path] || [];
      this.exportMgr[path].push(fn);
      return;
    }
    this.exportMgr[path] = fn;
  }

  removeQueue(path: string) {
    const fn = this.exportMgr[(window as any)._vue.$route.path];
    if (Array.isArray(fn) && fn.length) {
      fn.pop();
      return;
    }
    delete this.exportMgr[(window as any)._vue.$route.path];
  }
}

export default new ExportQueue();
