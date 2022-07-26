import request from '@/router/axios'

// 公共的字典转换接口
export function byKeyDicData (url) {
  return request({
    url: url,
    method: 'get'
  })
}

// 部门人员树
export function getDeptUserTree(){
  return request({
    url: `/mgr/jvs-auth//dept/user/tree`,
    method:'get'
  })
}

// 搜索用户
export function searchUser(params){
  return request({
    url: `/mgr/jvs-auth//user/user/search`,
    method:'get',
    params: params
  })
}