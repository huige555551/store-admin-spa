import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'nprogress/nprogress.css'
import api from '@/api'
import App from './App'
import router from './router'

require('es6-promise').polyfill()

Vue.config.productionTip = false

Vue.use(ElementUI)

// 导航钩子，每次变动都会检查登录状态
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const { code, data } = await api.get('/api/system/sysUser/login')
    if (code === 200) {
      if (!data.islogin) {
        return router.replace('login')
      }
    }
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    serverUrl: ''
  },
  router,
  template: '<App/>',
  components: { App }
})
