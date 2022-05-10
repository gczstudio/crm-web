import { backend, baseUrl } from "@/config";
import request from "@/utils/request";
import { UserModule } from "@/store/modules/user";
import eventQueue from "./eventQueue";

// Parse the time to string
export const parseTime = (time?: object | string | number | null, cFormat?: string): string | null => {
  if (time === undefined || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date: Date;
  if (typeof time === "object") {
    date = time as Date;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, "/");
      }
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return timeStr;
};

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) =>
    filterKeys.map((key: string) => {
      if (key === "timestamp") {
        return parseTime(data[key]);
      } else {
        return data[key];
      }
    })
  );

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += " " + className;
};

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
};

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return;
  }
  let classString = ele.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  ele.className = classString;
};

// 生成唯一识别号
export const genUUID = (len?: number, radix?: number) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

// 获取加密的公钥
export const getRSAPublicKey = () => {
  return "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrDUHc85ADQVxXRP4M90nqttWoZctV6JJVVdPjIle5vd9G2/4kgIhNc78Jd+ENxg+n4Gj9UMwNhJmb2jnMaW3zyGB+qi/ZrMO5dEUhW8salirzRgGg/4Arz4ObPmCWlZsws3Ij/3IEsFD3vMdIZD2j8b33DAbj47PjcCcMbtHYuQIDAQAB";
};

export const guid = (length = 12) => {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
};

export const debounce = (func: Function, wait: number, immediate: boolean) => {
  let timer: any = null;
  return () => {
    // var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        func();
        // func.apply(this, args);
      }
    } else {
      timer = setTimeout(() => {
        func();
        // func.apply(this, args);
      }, wait);
    }
  };
};

/**
 * 获取当前用户
 */
export const getUserInfo = () => {
  return JSON.parse(sessionStorage.getItem("userInfo") as string);
};

/**
 * 获取当前选中的角色
 */
export const getCheckedRole = (data?: any) => {
  const roles = (data || JSON.parse(sessionStorage.getItem("userInfo") as string))?.userRoles || [];
  return roles.find((item: any) => item.checked) || {};
};

/**
 * 格式化金额，千分位
 * @param money 金额
 * @param fixed 保留几位小数
 */
export const formatMoney = (money: any, fixed = 2) => {
  if (!money && money != 0) return "";
  money = parseFloat(money);
  // 如果是金额统一保留两位小数，bool为false，不是金额，整数不保留两位
  return (toFixed(money, fixed) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
};

/**
 * 格式化金额，自动转换单位
 * @param {*} money
 * @returns
 */
export const formatMoneyAutoUnit = (money: any) => {
  if (!money && money !== 0) {
    return {
      num: "",
      unit: "元",
    };
  }
  let symbol = money >= 0 ? "" : "-",
    unit = "元";
  let m = (money = Math.abs(money));
  if (money >= 10000) {
    m = money / 10000;
    unit = "万元";
  }
  if (money >= 1000000) {
    m = money / 100000000;
    unit = "亿元";
  }
  return {
    num: symbol + formatMoney(m, 2),
    unit,
  };
};

/**
 *
 * @param num
 * @param fixed
 * @returns 保留两位小数，四舍五入
 */
export const toFixed = (num: any, s = 2) => {
  let result = Math.round(num * Math.pow(10, s)) / Math.pow(10, s) + "";
  const pos = result.split(".")[1]?.length || 0;
  if (result.indexOf(".") === -1 && s) {
    result += ".";
  }
  for (let i = 0; i < s - pos; i++) {
    result += "0";
  }
  return result;
};

/**
 * 数组转树结构
 * @param data
 * @param id
 * @param pId
 * @returns
 */
export const arrayToTree = (data: any, id: string, pId: string) => {
  const result: any = [];
  if (!Array.isArray(data)) {
    return result;
  }
  const map: any = {};
  data.forEach((item) => {
    delete item.children;
    map[item[id]] = item;
  });

  data.forEach((item) => {
    const parent = map[item[pId]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

/**
 * 根据menuid获取到路由信息
 * @param id
 */
export const getRouteByMenuId = (id: string) => {
  const menus = JSON.parse(sessionStorage.getItem("contrMgr") as string)?.menu || [];
  return menus.find((item: any) => item.menuId === id) || {};
};

export const getUrl = (url: string) => {
  return baseUrl + url;
};

/**
 * 下载post请求
 * @param url
 * @param params
 */
export const downloadByPost = (url: string, params: any) => {
  if (url) {
    if (url.indexOf("http") <= -1) {
      // 当不包含http时拼接gateway地址
      url = getUrl(url);
    }
  } else {
    throw new Error("必须设置请求url!");
  }
  //
  const myForm = document.createElement("form");
  myForm.action = url;
  myForm.method = "post";
  // myForm.target = '_blank';
  for (const key in params) {
    const myInput = document.createElement("input");
    myInput.setAttribute("name", key);
    myInput.setAttribute("value", params[key]);
    myForm.appendChild(myInput);
  }
  document.body.appendChild(myForm);
  myForm.submit();
  document.body.removeChild(myForm);
};

// 不兼容ie9
export const downFile = (opts: any) => {
  const formData = new FormData();
  for (const i in opts.data) {
    formData.append(i, opts.data[i]);
  }
  request({
    method: opts.method || "post",
    url: opts.url,
    data: formData,
    responseType: "blob",
  }).then((res: any) => {
    const blob = new Blob([res]);
    const a = document.createElement("a");
    a.download = opts.fileName;
    const href = window.URL.createObjectURL(blob);
    a.href = href;
    document.body.appendChild(a); // 修复firefox中无法触发click
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(href);
  });
};

/**
 * 通用导出逻辑
 * @param _this 当前组件的this
 * @param apiParams 接口请求配置
 * @param tip 导出确认提示
 * @param ref 表格ref
 * @param showTipModal 表格ref
 */
export const exportTable = (config: any) => {
  const { _this, apiParams, tip, ref, showTipModal = true } = config;
  let total = 0;
  if (typeof ref === "number") {
    total = ref;
  } else {
    const refs = _this.$refs[ref || "refTable"];
    total = refs.pageTotal;
    if (!total && total !== 0 && refs.data) {
      total = refs.data.length;
    }
  }
  if (total == 0) {
    _this.$message({ message: "没有查询到要导出的数据！", type: "warning" });
    return;
  }
  const exportFn = () => {
    const loadingInstance = _this.$loading({
      text: "正在导出中",
    });
    request({
      method: "POST",
      url: apiParams.url,
      data: {
        condition: JSON.stringify(apiParams.params),
        sort: apiParams.sort,
      },
    }).then((response) => {
      loadingInstance.close();
      /**
       * 1 当前导出的数量过多
       * 2 当前系统下载人数过多
       * 3 导出错误
       */
      if (response.data.code === "1") {
        eventQueue.addEvent(response.data.fileName);
      }

      if (["1", "2", "3"].indexOf(response.data.code) !== -1) {
        _this.$alert(response.data.message, "提示", {
          type: "warning",
          confirmButtonText: "确定",
        });
        return;
      }
      const param = {
        fileName: response.data.fileName,
        filePath: response.data.filePath,
      };
      const url = getUrl(backend.fileService + "/api/downloadManage/downloadFile");
      downFile({
        method: "post",
        url: url,
        fileName: param.fileName,
        data: {
          access_token: UserModule.token,
          condition: JSON.stringify(param),
        },
      });
      // downloadByPost(url, {
      //   access_token: UserModule.token,
      //   condition: JSON.stringify(param)
      // });
    });
  };
  if (showTipModal) {
    _this.$confirm(tip || "是否确定导出?", "提示", {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning",
      callback: (action: any) => {
        if (action === "confirm") {
          exportFn();
        }
      },
    });
  } else {
    exportFn();
  }
};

/**
 * 格式化查询条件,将查询条件转换为json
 */

export const formatQueryField = (paramArrs: any) => {
  paramArrs = paramArrs.map((item: any) => {
    if (item.value) {
      return item.cnName + ":" + item.value;
    }
  });
  return paramArrs
    .filter((item: any) => {
      return item;
    })
    .join(",");
};

/**
 * 将驼峰命名转换成大写下划线
 * @param str
 * @returns
 */
export const humpToline = (str: any) => {
  return str.replace(/([A-Z])/g, "_$1").toUpperCase();
};

/**
 * 使用form进行post请求跳转第三方系统
 * @param options
 */
export const formPost = (options: any) => {
  //发起post请求跳转到第三方
  const form = document.createElement("form");
  form.action = options.path;
  form.enctype = "application/x-www-form-urlencoded";
  form.method = "post";
  form.target = "_blank";
  for (const key in options.loginInfo) {
    const myInput = document.createElement("input");
    myInput.setAttribute("name", key);
    myInput.setAttribute("value", options.loginInfo[key]);
    form.appendChild(myInput);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
