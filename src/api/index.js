/*
 * API 封装
 * 参考资料
 *   1. http://vue2.mmxiaowu.com/article/589af8cde9be1c5b21ef8e9c
 */

import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import { Notification } from 'element-ui'
import router from '@/router'
import config2 from '../../serverHost'

// API 服务器地址
const serverHost = config2.serverHost

// 请求时的拦截器
axios.interceptors.request.use(config => {
  // 这里可以加一些动作, 比如来个进度条开始动作
  NProgress.start()
  return config
}, error => {
  return Promise.reject(error)
})

// 请求完成后的拦截器
axios.interceptors.response.use(response => response, error => {
  // 这里我们把错误信息捕捉, 后面就不需要写 catch 了
  return Promise.resolve(error.response)
})

function checkStatus(response) {
  NProgress.done()
  // 如果 http 状态码正常, 则直接返回数据
  if (response.status === 200 || response.status === 304) {
    // 这里, 如果不需要除 data 外的其他数据, 可以直接 return response.data, 这样可以让后面的代码精简一些
    if (response.data.status.errCode === 200) {
      return {
        code: response.data.status.errCode,
        data: response.data.data
      }
    }
    return {
      code: response.data.status.errCode,
      data: response.data.status.message
    }
  }
  // 异常状态下, 把错误信息返回去
  return {
    code: response.status,
    data: response.statusText
  }
}

// 处理来自后端的错误
function checkCode(res) {
  if (res.code === 503) {
    return router.replace('login')
  } else if (res.code !== 200) {
    Notification.error({ title: '警告', message: `${res.code} ${res.data}. ` })
    console.log(res.data)
  }
  return res
}

export default {
  post(url, data) {
    return axios({
      method: 'post',
      url: serverHost + url,
      data: qs.stringify(data),
      timeout: 30000,
      withCredentials: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkStatus).then(checkCode)
  },
  get(url, params) {
    return axios({
      method: 'get',
      url: serverHost + url,
      params,
      timeout: 30000,
      withCredentials: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  }
}
