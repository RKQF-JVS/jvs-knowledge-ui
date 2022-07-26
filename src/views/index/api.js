import request from '@/router/axios'

// 查询用户有权限的知识库
export function getDcLibraryList(query) {
  return request({
    url: "/mgr/document/dcLibrary/knowledges",
    method: "get",
    params: query
  });
}

// 查询用户自己创建的知识库
export function knowledgesOwner(query) {
  return request({
    url: "/mgr/document/dcLibrary/knowledges/owner",
    method: "get",
    params: query
  });
}

// 删除知识库
export function delDcLibrary(id) {
  return request({
    url: `/mgr/document/dcLibrary/${id}`,
    method: "delete",
  });
}
