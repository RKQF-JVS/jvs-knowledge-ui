import request from '@/router/axios'

// 获取目录树
export function documentSearch(params) {
  return request({
    url: `/mgr/document/dcLibrary/document/search`,
    method: "get",
    params: params
  });
}

//获取文件已读次数
export function readNumber(id) {
  return request({
    url: `/mgr/document/dcLibrary/document/read/total/${id}`,
    method: "get",
  });
}

// 获取文档编辑记录
export function editLog(params) {
  return request({
    url: `/mgr/document/dcLibrary/document/edit/log`,
    method: 'get',
    params: params
  })
}

//获取点赞人员列表
export function getLike(params) {
  return request({
    url:`/mgr/document/dcLibrary/like`,
    method:'get',
    params: params
  })
}

//点赞操作
export function giveGood(params) {
  return request({
    url:`/mgr/document/dcLibrary/like`,
    method:'post',
    params: params
  })
}

//获取知识库留言分页
export function getComment(id,data) {
  return request({
    url:`/mgr/document/dcLibrary/comment/page/${id}`,
    method:'get',
    params: data
  })
}

//添加留言
export function leaveMsg(data) {
  // console.log(data);
  return request({
    // url:`/mgr/document/dcLibrary/comment/save/${data.id}?message=${data.message}`,
    url:`/mgr/document/dcLibrary/comment/save`,
    method:'post',
    data: data
  })
}
// 重命名知识库-目录-文档，或设置知识库
export function setLibrary(data) {
  return request({
    url:`/mgr/document/dcLibrary`,
    method:'put',
    data: data
  })
}

// 添加知识库、目录、文件
export function addLibrary(data) {
  return request({
    url:`/mgr/document/dcLibrary`,
    method:'post',
    data: data
  })
}

// 查询知识库成员
export function queryMember(id, params) {
  return request({
    url:`/mgr/document/dcLibrary/query/member/${id}`,
    method:'get',
    params: params
  })
}

// 知识库成员角色修改
export function setMemberRole(documentId, userId, role) {
  return request({
    url:`/mgr/document/dcLibrary/modify/role/${documentId}/${userId}/${role}`,
    method:'put'
  })
}

// 添加知识库成员
export function addMember(data) {
  return request({
    url:`/mgr/document/dcLibrary/add/member`,
    method:'put',
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

// 保存文档
export const saveContent = (contentId, data) => {
  return request({
    url: `/mgr/document/dcLibrary/save/content/${contentId}`,
    method: 'post',
    data: data
  })
}

// 删除知识库成员
export function delMember(documentId, userId) {
  return request({
    url:`/mgr/document/dcLibrary/delete/member/${documentId}/${userId}`,
    method:'delete',
  })
}

// 删除用户留言
export function delMsg(id) {
  return request({
    url:`/mgr/document/dcLibrary/comment/del/${id}`,
    method:'delete',
  })
}

// 自定义上传富文本图片
export function uploadImage(data) {
  return request({
    url:`/api/file/upload/jvshtmleditor`,
    method:'post',
    data: data
  })
}