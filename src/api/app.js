import request from './request'

export function getOssSin (data) {
  return request({
    method: 'post',
    data,
    url: '/upload/getPolicy'
  })
}

export function getAppList () {
  return request({
    method: 'get',
    url: '/list/getAppList'
  })
}

export function getVersionList (params) {
  return request({
    method: 'get',
    params,
    url: '/list/getVersionList'
  })
}

export function downloadapp (id) {
  return request({
    method: 'get',
    url: `/tools/download/${id}`
  })
}
