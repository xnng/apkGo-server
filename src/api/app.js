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
    url: '/upload/getAppList'
  })
}
