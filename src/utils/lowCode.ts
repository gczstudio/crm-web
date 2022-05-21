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
        callback && callback(item);
      } else {
        item.body?.length && fn(item.body);
      }
    }
  };
  fn(pageConfig.body);
  return pageConfig;
};
