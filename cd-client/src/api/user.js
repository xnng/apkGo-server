import request from './request'

export function getOssSin (data) {
  return request({
    method: 'get',
    url: '/getPolicy'
  })
}

export function uploadToOss (url, data) {
  return request({
    method: 'post',
    url,
    data
  })
}
