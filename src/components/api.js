import request from '@/router/axios'

// 用户列表
export function getUserList(query) {
  return request({
    url: "/mgr/jvs-auth//user/page",
    method: "get",
    params: query
  });
}
// 所有用户
export function getUserAll(query) {
  return request({
    url: "/mgr/jvs-auth//user/user/search",
    method: "get",
    params: query
  });
}
