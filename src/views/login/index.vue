<template>
  <div class="login-container" v-if="showLogin">
    <div class="login-header">
      <img :src="require(`@/assets/images/login/yx-logo.png`)" alt />
    </div>
    <div class="login-box">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
        @keyup.enter.native="handleLogin"
      >
        <div class="login-title">
          <img :src="require(`@/assets/images/login/logo.png`)" alt />
        </div>
        <div class="login-content listname">
          <el-form-item prop="username">
            <span class="svg-container">
              <i class="icon iconfont">&#xe633;</i>
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名称"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="new-username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <i class="icon iconfont">&#xe632;</i>
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入用户密码"
              name="password"
              tabindex="2"
              autocomplete="new-password"
            />
            <span class="show-pwd" @click="showPwd">
              <i
                :class="[
                'iconfont',
                passwordType === 'password' ?  'icon-yincangmima' :'icon-yanjing',
              ]"
              ></i>
            </span>
          </el-form-item>
          <div
            v-loading="loading"
            class="login-btn"
            @click.prevent="handleLogin"
          >登&emsp;录</div>
        </div>
      </el-form>
    </div>
    <!-- <div class="animate-text"></div>
    <img v-for="item in 5" :key="item" :class="`meteor meteor${item}`" src="../../assets/images/login/meteor2.png" alt=""> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { Form as ElForm, Input } from "element-ui";
import { UserModule } from "@/store/modules/user";
import { baseUrl, backend } from "@/config";
import { queryLogicsyskv, verifyCodeImage } from "@/api/users";
import { genUUID, getRSAPublicKey } from "@/utils";
import { JSEncrypt } from "jsencrypt";
import { addloginlog } from '@/api/common'

const clientId = genUUID(16, 16) + Date.now();

@Component({
  name: "Login",
  components: {},
})
export default class extends Vue {
  imageCodeUrl: string =
    baseUrl +
    backend.uaaService +
    "/api/codeImage/" +
    clientId +
    "?t=" +
    new Date().getTime();

  private validateUsername = (rule: any, value: string, callback: any) => {
    if (!value) {
      callback(new Error("请输入用户名称"));
    } else {
      callback();
    }
  };

  private validatePassword = (rule: any, value: string, callback: any) => {
    if (!value) {
      callback(new Error("请输入用户密码"));
    } else {
      callback();
    }
  };

  private validateImageCode = (rule: any, value: string, callback: any) => {
    if (!value) {
      callback(new Error("请输入验证码"));
    } else {
      callback();
    }
  };

  private loginForm = {
    username: "",
    password: "",
    imageCode: "",
  };

  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: "change" }],
    password: [{ validator: this.validatePassword, trigger: "change" }],
    imageCode: [{ validator: this.validateImageCode, trigger: "change" }],
  };

  private passwordType = "password";
  // private loading = false;
  private showDialog = false;
  sysLogicId = "";
  private showLogin = false;

  get loading() {
    return UserModule.loading;
  }

  // @Watch('loading')
  // onLoadingChange() {
  //   if(!this.loading) this.refreshImageCode();
  // }

  @Watch("$route", { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const { j_username, j_password } = this.$route.query;
    if (j_username && j_password) {
      this.loginFn("AD", j_username, j_password);
      this.showLogin = false;
      localStorage.setItem("authType", "AD");
      return;
    }
  }

  /**
   * 登录三种情况
   *
   * http://192.16.68.152:8080/edmp/#/login?j_username=xxx&j_password=xxx  AD
   * http://192.16.68.152:8080/edmp/#/login AD
   * http://192.16.68.152:8080/edmp/#/login?authType=uaa
   */

  async created() {
    let res = await this.getlogicSysFn();
    this.sysLogicId = res.data[0].key;
    const { j_username, j_password } = this.$route.query;
    // AD
    this.$nextTick(() => {
      if (j_username && j_password) {
        this.loginFn("AD", j_username, j_password);
        this.showLogin = false;
        localStorage.setItem("authType", "AD");
        return;
      }
      this.showLogin = true;
    });
  }

  private showPwd() {
    if (this.passwordType === "password") {
      this.passwordType = "";
    } else {
      this.passwordType = "password";
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus();
    });
  }

  // 查询系统逻辑参数
  async getlogicSysFn() {
    return queryLogicsyskv({});
  }

  // 登录
  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        UserModule.SET_LOADING(true);
        const { authType } = this.$route.query;
        this.loginFn(authType || "AD");
        // let res = await this.checkImageCode();
        // // 校验成功
        // if (res) {
        //   this.loginFn();
        // } else {
        //   this.$message.error("验证码错误");
        //   UserModule.SET_LOADING(false);
        //   this.refreshImageCode();
        // }
      } else {
        return false;
      }
    });
  }

  // 刷新验证码
  refreshImageCode() {
    this.imageCodeUrl =
      baseUrl +
      "/yusp-uaa/api/codeImage/" +
      clientId +
      "?t=" +
      new Date().getTime();
  }

  // 校验验证码
  async checkImageCode() {
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Basic d2ViX2FwcDo=",
    };

    let data = {
      clientId: clientId,
      imageCode: this.loginForm.imageCode,
    };

    return verifyCodeImage(data, { headers });
  }

  // 调登录接口
  loginFn(authType: any, username?: any, password?: any) {
    const { j_username, j_password } = this.$route.query;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: "Basic d2ViX2FwcDo=",
    };

    localStorage.setItem("authType", authType);

    let data = {
      authType,
      clientId: clientId,
      grant_type: "password",
      passwordType: "2",
      sysId: this.sysLogicId,
      // ...this.loginForm,
      username: username || this.loginForm.username,
      password: this.encodePassword(password || this.loginForm.password),
    };

    UserModule.Login({
      data,
      headers,
    }).then((res) => {
      // 记录登录日志
      addloginlog({
        loginChnl:"P",
        tokenId: res.refresh_token
      })
      // 保存当前登录用户的信息
      let loginInfo = {
        username: data.username,
        password: password || this.loginForm.password,
      };
      sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    });
  }

  // 密码加密
  encodePassword(pwd: string) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(getRSAPublicKey());
    var encryptPwd = encrypt.encrypt(pwd);
    return encryptPwd;
  }
}
</script>
<style lang="scss">

.login-container {
  .iconfont {
    color: #3DF1E7;
  }
  .el-input {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 60px);
    position: relative;
    top: 0px;
    font-size: 16px;
    input {
      height: 50px;
      line-height: 50px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 0 5px 0 15px;
      color: #3DF1E7;
      -webkit-appearance: none;
      &:-webkit-autofill {
        transition: color 99999s ease-out, background-color 99999s ease-out;
        transition-delay: 99999s;
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
      }
      &::-webkit-input-placeholder {
        color: #3DF1E7;
      }
    }
  }
  .el-form-item__error {
    padding-top: 5px;
  }

  .el-form-item {
    position: relative;
    margin-bottom: 28px;
    padding: 0 10px;
    background: url("../../assets/images/login/input-bg.png") no-repeat center;
    height: 50px;
    vertical-align: middle;
  }
}
</style>
<style lang="scss" scoped>
  .login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: url("../../assets/images/login/bg.png") no-repeat center;
    background-size: 100% 100%;
    .login-header {
      position: absolute;
      top: 50px;
      left: 100px;
      img{
        width: 200px;
      }
    }
    .login-box {
      .login-form {
        position: absolute;
        top: 50%;
        right: 195px;
        transform: translateY(-50%);
        z-index: 3;
        width: 701px;
        height: 515px;
        background: url("../../assets/images/login/login-box-bg.png") no-repeat center;
        .svg-container {
          .iconfont {
            font-size: 20px;
            padding-right: 10px;
            border-right: 1px solid #3DF1E7;
          }
        }
        .login-title {
          margin-left: 22px;
          text-align: center;
          img{
            width: 412px;
            height: 73px;
          }
        }
        .login-content {
          padding: 34px 60px;
          position: absolute;
          top: 90px;
          left: 156px;
          width: 421px;
          height: 303px;
          background: url("../../assets/images/login/login-bg.png") no-repeat center;
        }
        .login-btn {
          cursor: pointer;
          text-align: center;
          margin-top: 20px;
          height: 61px;
          line-height: 61px;
          width: 100%;
          background: url("../../assets/images/login/submit-bg.png") no-repeat center;
          font-size: 22px;
          color: #00FFCC;
          border: 0;
          &.el-loading-parent--relative {
            ::v-deep.el-loading-mask {
              background: transparent;
            }
          }
        }
      }
    }
    .show-pwd {
      width: 16px;
      height: 16px;
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 20px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }
    .animate-text {
      animation: upText 8s linear infinite;
      width: 100%;
      height: 578px;
      position: absolute;
      left: 0;
      bottom: -500px;
      z-index: 1;
      // background: url("../../assets/images/login/up-text.png") no-repeat center;
    }

    @keyframes upText {
      from {
        bottom: -500px;
        opacity: 1;
      }
      to {
        bottom: 0px;
        opacity: 0;
      }
    }

    .meteor {
      position: absolute;
      width: 165px;
      height: 165px;
      z-index: 2;
    }

    @for $i from 1 through 5 {
      .meteor#{$i} {
        animation: animate-meteor + $i 8s linear #{3*($i - 1)}s infinite forwards;
        right: 200 * $i + px;
        top: -165 - 50 * $i + px;
      }

      @keyframes animate-meteor#{$i} {
        0% {
          right: 200 * $i + px;
          top: -165 - 50 * $i + px;
          opacity: 1;
        }
        100% {
          right: 933 + 200 * $i + px;
          top: 933px;
          opacity: 0;
        }
      }
    }

    .listname {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

  }

  @media screen and (max-width: 1680px) { 
    .login-container {
      .login-header {
        img {
          height: 69px;
        }
      }
      .login-box {
        .login-form {
          right: 167px;
          width: 489px;
          height: 465px;
          background-size: 489px 332px;
          .login-title {
            margin-left: 8px;
            img{
              width: 423px;
            }
          }
          .login-content {
            top: 76px;
            left: 89px;
            padding: 29px 40px;
            width: 332px;
            height: 240px;
            background-size: 332px 240px;
          }
          .login-btn {
            height: 40px;
            line-height: 40px;
            background-size: 128px 40px;
            font-size: 16px;
          }
        }
      }

      ::v-deep.el-form-item {
        margin-bottom: 24px;
        background-size: 240px 40px;
        height: 40px;
        .el-input {
          width: calc(100% - 60px);
          font-size: 14px;
          input {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
</style>
