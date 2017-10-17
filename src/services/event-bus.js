export default {
  install(Vue) {
    /*eslint-disable*/
    Vue.prototype.$bus = new Vue({})
  }
}

