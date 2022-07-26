import request from '@/router/axios'

// 保存文档
export const saveContent = (contentId, data) => {
  return request({
    url: `/mgr/document/dcLibrary/save/content/${contentId}`,
    method: 'post',
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

// 更新文档为编辑状态
export const changeStatus = (id, action) => {
  return request({
    url: `/mgr/document/dcLibrary/status/document/${id}/${action}`,
    method: 'put'
  })
}

// 修改文档设置
export const editLib = (data) => {
  return request({
    url: `/mgr/document/dcLibrary`,
    method: 'put',
    data: data
  })
}
