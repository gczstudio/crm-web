import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { UserModule } from "@/store/modules/user";
import { baseUrl } from "@/config";
import router from "@/router";
import { getCheckedRole } from "@/utils";
import { getSessionInfo, switchRoleOrg } from "@/api/users";

const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  timeout: 30000,
  withCredentials: true, // send cookies when cross-domain requests
});

let isRefreshing = false;
let requests: any = [];

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      // config.headers['Authorization'] = 'Bearer ' + UserModule.token
      if (!config.url?.includes("oauth/token")) {
        config.headers["Authorization"] = "Bearer " + UserModule.token;
      }
    }

    if (config.url?.includes("mock-api")) {
      config.baseURL = "";
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 成功状态码
const scucessCodes = [0, 20100003, 20100000, 20100021, "10100001"];

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    const res = response.data;
    UserModule.loading && UserModule.SET_LOADING(false);

    if (res.code === "10000001" && response.config.url.includes("oauth/token") && res.message.includes("Invalid refresh token")) {
      Message({
        message: "登录失效，请重新登录！",
        type: "error",
        duration: 3 * 1000,
      });
      setTimeout(() => {
        const authType = localStorage.getItem("authType");
        UserModule.Reset();
        router.push({ path: authType === "uaa" ? "/login?authType=uaa" : "login" });
        location.reload();
      }, 3 * 1000);
      return Promise.reject(response);
    }
    // customHandler 自定义处理异常
    if (res.code && !scucessCodes.includes(res.code) && !response.config.customHandler) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 3 * 1000,
      });
      return Promise.reject(new Error(res.message || "Error"));
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const tokenInfo = JSON.parse(sessionStorage.getItem("tokenInfo") as any);
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: "Basic d2ViX2FwcDo=",
        };

        if (!tokenInfo?.refresh_token) {
          Message({
            message: "登录失效，请重新登录！",
            type: "error",
            duration: 3 * 1000,
          });
          setTimeout(() => {
            const authType = localStorage.getItem("authType");
            UserModule.Reset();
            router.push({ path: authType === "uaa" ? "/login?authType=uaa" : "login" });
            location.reload();
          }, 3 * 1000);
          return Promise.reject(error);
        }

        const data = {
          grant_type: "refresh_token",
          refresh_token: tokenInfo.refresh_token,
        };

        if (error.config.data && typeof error.config.data === "string") error.config.data = JSON.parse(error.config.data);
        // access_token过期后使用refresh_token刷新
        return UserModule.refreshLogin({
          data,
          headers,
        })
          .then((res) => {
            // 重新调用getSessionInfo，是因为刷新后，跟用户角色相关的接口会报错
            return getSessionInfo().then((res) => {
              // refresh_token刷新后，角色会恢复初始，如果切换角色后，需重新调用switchRoleOrg 设置当前角色
              const checkedRole = getCheckedRole(res);
              const currentRole = sessionStorage.getItem("currentRole") ? JSON.parse(sessionStorage.getItem("currentRole") as any) : "";
              if (currentRole && currentRole.userRoleRelId !== checkedRole.roleId) {
                return switchRoleOrg(currentRole).then((res) => {
                  requests.forEach((cb: any) => cb());
                  requests = [];
                  return service(error.config);
                });
              } else {
                requests.forEach((cb: any) => cb());
                requests = [];
                return service(error.config);
              }
            });
          })
          .catch((error) => {
            return Promise.reject(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        return new Promise((resolve) => {
          requests.push(() => {
            resolve(service(error.config));
          });
        });
      }
    }
    Message({
      message: error.message,
      type: "error",
      duration: 3 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
