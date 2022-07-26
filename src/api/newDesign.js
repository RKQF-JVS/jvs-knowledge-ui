import request from '@/router/axios'

// 默认请求
export const sendRequire = (url, method, data) => {
  let obj = {
    url: url,
    method: method
  }
  if(data) {
    if(method == 'get' || method == 'delete') {
      obj.params = data
    }else{
      obj.data = data
    }
  }
  return request(obj)
}

// 自定义请求
export const sendMyRequire = (http, data) => {
  let obj = {
    url: http.url,
    method: http.httpMethod,
    headers: {
      'Content-Type': http.requestContentType
    }
  }
  if(data) {
    if(http.requestContentType == 'application/x-www-form-urlencoded') {
      obj.params = data
    }else{
      obj.data = data
    }
  }
  if(http.headers) {
    obj.headers = Object.assign(http.headers, http.headers)
  }
  return request(obj)
}

// 绑定手机
export function bindPhone(data) {
  return request({
    url: "/mgr/jvs-auth/index/bind/phone",
    method: "put",
    params: data
  });
}

// 发送手机验证码
export function sendPhoneCode(phone) {
  return request({
    url: `/auth/phone/sms/bind/${phone}`, // `/auth/phone/sms/verification/${phone}`,
    method: "get",
  });
}
