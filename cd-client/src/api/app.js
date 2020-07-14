import request from './request'

export function getOssSin (data) {
  return request({
    method: 'post',
    data,
    url: '/getPolicy'
  })
}

export function getAppList () {
  return request({
    method: 'get',
    url: '/getAppList'
  })
}
