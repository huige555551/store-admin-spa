class Rbac {
  constructor(Vue, { user }) {
    this.Vue = Vue
    this.user = user
    this.addVueMethods()
  }

  getCurrentUser() {
    if (this.user) {
      return this.user
    }
    this.user = JSON.parse(localStorage.getItem('user'))
    return this.user
  }
  addVueMethods() {
    const self = this
    self.Vue.prototype.$isAllowModule = function(authority) {
      self.getCurrentUser()
      return self.user.moduleAuthorityArray.includes(authority)
    }
    self.Vue.prototype.$isAllowUser = function(authority) {
      self.getCurrentUser()
      return self.user.useraAuthorityArray.includes(authority)
    }
    self.Vue.prototype.$clearRbacUser = function() {
      self.user = null
    }
  }
}

export default {
  install(Vue, { user }) {
    const vm = new Rbac(Vue, { user })
    return vm
  }
}
