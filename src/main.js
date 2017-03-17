import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'

// const request = require('superagent')

Vue.config.productionTip = false

Vue.use(ElementUI)

// 导航钩子，每次变动都会检查登录状态
router.beforeEach((to, from, next) => {
  // request
  //   .get('/api/system/sysUser/login')
  //   .end((err, res) => {
  //     console.log(res.body)
  //     if (err || !res.body || !res.body.status || res.body.status.errCode !== 200) {
  //       return router.replace('login')
  //     }
  //     next()
  //   })
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
