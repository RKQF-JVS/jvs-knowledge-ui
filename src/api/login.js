import request from "@/router/axios";
import {scope, client_id, client_secret, grant_type} from '@/const/const'

export const loginByUsername = (username, password, code, randomStr) => {
  return request({
    url: `/auth/oauth/token`,
    headers: {
      isToken: false,
    },
    method: "post",
    params: { username, password, grant_type, scope, client_id, client_secret }
  });
};

export const refreshToken = (refresh_token, tenantId) => {
  const grant_type = "refresh_token";
  return request({
    url: "/auth/oauth/token",
    headers: {
      isToken: false,
    },
    method: "post",
    params: { grant_type, scope, client_id, client_secret, refresh_token: refresh_token, switch: tenantId }
  });
};

export function getQRcode(params) {
  return request({
    url: "/mgr/upms/oauth",
    method: "get",
    params: params
  });
}

export function getCheck(data) {
  return request({
    url: "/weixin/check",
    method: "get",
    params: data,
    // 设置超时时间,直接进行下一次请求
    timeout: 30 * 1000
  });
}

// 发送验证码
export function getPhone(data) {
  return request({
    url: `/auth/phone/sms/verification/${data.phone}`,
    method: "get"
  });
}

// 忘记密码---发送验证码
export function getPhoneCode(data) {
  return request({
    url: `/mgr/upms/reset/code/${data.phone}/${data.idStr}`, // /mgr/upms/user/phone/${data.phone}
    method: "get"
  });
}

// 验证码登录
export function codeLogin(data) {
  return request({
    url: "/auth/login/other",
    method: "get",
    headers: {
      isToken: false,
      // tenantId: store.getters.tenantId ? store.getters.tenantId : 0
    },
    params: { client_id, client_secret, login_other_auth_parameter: data }
  });
}
// 微信登录
export function wxOpenidLogin(data) {
  return request({
    url: "/auth/login/wx/token",
    method: "get",
    headers: {
      isToken: false,
    },
    params: data
  });
}
// APP二维码登录
export function appQrLogin(data) {
  return request({
    url: "/mgr/upms/app/oauth",
    method: "get",
    headers: {
      isToken: false,
    },
    params: data
  });
}

// 检查APP扫码
export function appCheck(data){
  return request({
    url: `/mgr/upms/app/check/${data.uuid}`,
    method: "get",
    headers: {
      isToken: false,
    },
    params: data
  });
}
// app登录
export function appLogin(data) {
  return request({
    url: "/auth/login/app/token",
    method: "get",
    headers: {
      isToken: false,
    },
    params: data
  });
}


export const resetPass = (data) => {
  return request({
    url: "/mgr/upms/reset/verify/password",
    headers: {
      isToken: false,
      // Accept: "application/x-www-form-urlencoded"
      "Content-type": "text/plain", // "application/json"
    },
    method: "post",
    data, // {ciphertext: str}
  });
};

// 退出登录
export const loginoutHandle = () => {
  return request({
    url: `/auth/token/logout`,
    method: "get"
  });
};
