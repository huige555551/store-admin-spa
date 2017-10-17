import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'nprogress/nprogress.css'
import api from '@/api'
import App from './App'
import router from './router'
import RBAC from './services/rbac'
import eventBus from './services/event-bus'

require('es6-promise').polyfill()

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(RBAC, { user: window.user })
Vue.use(eventBus)


// 导航钩子，每次变动都会检查登录状态
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const { code } = await api.get('/api/auth/isLogin')
    if (code === 200) {
      next()
    } else {
      return router.push('/login')
    }
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
