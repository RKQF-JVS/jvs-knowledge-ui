import request from "@/router/axios"

// 获取下拉列表
export const getSelectData = (str) => {
  return request({
      url: str,
      method: 'get',
  })
}