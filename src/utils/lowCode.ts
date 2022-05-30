/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2022-05-16 09:24:28
 * @LastEditors: gaocz
 * @LastEditTime: 2022-05-19 16:03:06
 * @FilePath: /edmp-web/src/utils/lowCode.ts
 */

import { LowCodeModule } from "@/store/modules/lowCode";
import _ from "lodash";
import request from "@/utils/request";
import lookup from "./lookup";
import { getUrlParams } from "@/utils";
/**
 * 根据id获取某个组件的配置数据
 * @param id
 */
export const getCompConfigById = (id: string) => {
  let configData = {};
  recursionFn(id, (item: any) => {
    configData = item;
  });
  return configData;
};

/**
 * 设置pageConfig
 * @param id
 * @param configData
 */
export const setCompConfigById = (id: string, configData: any) => {
  const pageConfig = recursionFn(id, (item: any) => {
    item = Object.assign(item, configData);
  });
  LowCodeModule.SET_PAGE_CONFIG(pageConfig);
};

/**
 * 删除某个组件
 * @param id
 * @param configData
 */
export const clearCompConfig = (id: string) => {
  const pageConfig = recursionFn(id, (item: any, body: any) => {
    const indexs = body.map((ele: any) => ele.id);
    body.splice(indexs.indexOf(id), 1);
  });
  LowCodeModule.SET_PAGE_CONFIG(pageConfig);
};

/**
 * 添加子组件
 * @param id
 * @param configData
 */
export const appendToPageById = (id: string, configData: any) => {
  let itemData = {};
  const pageConfig = recursionFn(id, (item: any) => {
    item.body = [...item.body, configData];
    itemData = _.cloneDeep(item);
  });
  // 如果没有找到，直接添加到主layout body中
  if (!Object.keys(itemData).length) {
    (pageConfig.body[0] as any).body = [...(pageConfig.body[0] as any).body, configData];
  }
  LowCodeModule.SET_PAGE_CONFIG({ ...pageConfig });
};

/**
 * 遍历pageConfig，根据id
 * @param id
 * @param callback
 */
export const recursionFn = (id: string, callback: Function) => {
  const pageConfig = LowCodeModule.pageConfig;
  const fn = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.id && item.id === id) {
        callback && callback(item, data);
      } else {
        item.body?.length && fn(item.body);
      }
    }
  };
  fn(pageConfig.body);
  return pageConfig;
};

/**
 * 对从组件注册中获取属性的可选值的处理-下拉框数据处理
 * @param configList
 */
export const formatConfitItem = (configList: any) => {
  const codeObj: any = {},
    urlObj: any = {},
    urlParamsObj: any = {};
  configList.map((item: any, index: number) => {
    if (item.valChoose) {
      item.ctype = "select";
      if (item.valChoose.includes(",")) {
        item.options = item.valChoose.split(",").map((option: any) => {
          const index = option.indexOf("[");
          if (index !== -1) {
            return {
              key: option.slice(0, index),
              value: option.slice(index + 1, -1),
            };
          }
          return {
            key: option,
            value: option,
          };
        });
      } else if (item.valChoose.includes("/")) {
        urlObj[item.valChoose] = urlObj[item.valChoose] || [];
        urlObj[item.valChoose].push(index);
      } else {
        codeObj[item.valChoose] = codeObj[item.valChoose] || [];
        codeObj[item.valChoose].push(index);
      }
    }
  });
  if (Object.keys(codeObj).length) {
    lookup.reg(Object.keys(codeObj).join(","), (data: any) => {
      Object.keys(codeObj).map((code: string) => {
        codeObj[code].map((idx: number) => {
          configList[idx].options = data[code];
        });
      });
    });
  }
  if (Object.keys(urlObj).length) {
    const promises = Object.keys(urlObj).map((url) => {
      let params = {};
      if (url.includes("?")) {
        params = getUrlParams(url);
        urlParamsObj[url] = params;
      }
      return request({
        url: url.split("?")[0],
        method: "get",
        params: {
          condition: JSON.stringify(params),
          page: 1,
          size: 200,
        },
      });
    });
    Promise.all(promises).then((results) => {
      Object.keys(urlObj).map((url: string, index: number) => {
        urlObj[url].map((idx: number) => {
          if (urlParamsObj[url]?.key) {
            (configList[idx] as any).options = results[index].data.map((ele: any) => {
              return {
                key: ele[urlParamsObj[url].key],
                value: ele[urlParamsObj[url].value],
              };
            });
          } else {
            configList[idx].options = results[index].data;
          }
        });
      });
    });
  }
};
