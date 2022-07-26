import request from '@/router/axios'

// 分页查询
export const pageList = (params) => {
  return request({
    url: `/mgr/document/dcLibrary/page`,
    method: 'get',
    params:  params
  })
}

// 获取文件树
export const dcLibTree = () => {
  return request({
    url: `/mgr/document/dcLibrary/tree`,
    method: 'get'
  })
}

// 添加知识库、目录、文件
export const addLib = (data) => {
  return request({
    url: `/mgr/document/dcLibrary`,
    method: 'post',
    data: data
  })
}

// 删除
export const delLib = (id) => {
  return request({
    url: `/mgr/document/dcLibrary/${id}`,
    method: 'delete'
  })
}

// 修改知识库设置
export const editLib = (data) => {
  return request({
    url: `/mgr/document/dcLibrary`,
    method: 'put',
    data: data
  })
}

// 预览文档
export const preview = (id) => {
  return request({
    url: `/mgr/document/dcLibrary/preview/document/${id}`,
    method: 'get'
  })
}

// 查询知识库成员
export const queryUser = (id, params) => {
  return request({
    url: `/mgr/document/dcLibrary/query/member/${id}`,
    method: 'get',
    params: params
  })
}

// 添加知识库成员
export const addmember = (data) => {
  return request({
    url: `/mgr/document/dcLibrary/add/member`,
    method: 'put',
    data: data
  })
}

// 知识库成员角色修改
export const modifyRole = (documentId, userId, role) => {
  return request({
    url: `/mgr/document/dcLibrary/modify/role/${documentId}/${userId}/${role}`,
    method: 'put'
  })
}

// 删除知识库成员
export const delmember = (documentId, userId) => {
  return request({
    url: `/mgr/document/dcLibrary/delete/member/${documentId}/${userId}`,
    method: 'delete'
  })
}
