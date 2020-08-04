import axios from 'axios'
import { Message } from 'element-ui'

const request = axios.create({
  // baseURL: 'https://service-52prhkko-1254232777.gz.apigw.tencentcs.com/release',
  baseURL: 'http://ali.xnngs.cn:3003',
  timeout: 50 * 1000
})

axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    if (response.data.code === -1) {
      Message.error(response.data.msg)
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default request
