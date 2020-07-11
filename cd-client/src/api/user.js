import request from './request'

export function getOssSin (data) {
  return request({
    method: 'post',
    data,
    url: '/getPolicy'
  })
}
