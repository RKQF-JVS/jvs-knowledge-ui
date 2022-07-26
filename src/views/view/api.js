import request from '@/router/axios'

// 获取目录树
export function getLibTree(id) {
  return request({
    url: `/mgr/document/dcLibrary/tree`,
    method: "get",
    params: {id: id}
  });
}

// 查询文档编辑记录
export function getLibEditLog(params) {
  return request({
    url: `/mgr/document/dcLibrary/document/recently/updated`,
    method: "get",
    params: params
  });
}

// 查询知识库成员
export function getLibMember(id,params) {
  return request({
    url: `/mgr/document/dcLibrary/query/member/${id}`,
    method: "get",
    params: params
  });
}

// 查询指定目录下(不含子目录)所有文件
export function getDocumentList(id) {
  return request({
    url: `/mgr/document/dcLibrary/document/list/${id}`,
    method: "get"
  });
}
