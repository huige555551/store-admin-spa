import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: 'admin',
  mode: 'history',
  /* eslint-disable */
  scrollBehavior(to, from, savedPosition) {
    // 对于所有路由导航，简单地让页面滚动到顶部
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/login', component: resolve => require(['@/components/page/Login.vue'], resolve) },
    {
      path: '/',
      component: resolve => require(['@/components/common/Home'], resolve),
      children: [
        { path: '', component: resolve => require(['@/components/page/Welcome'], resolve) },
        { path: '/welcome', component: resolve => require(['@/components/page/Welcome'], resolve) },
        // 用户管理
        { path: '/user/list', component: resolve => require(['@/components/page/User.vue'], resolve) },
         // 首页管理
        { path: '/index/banner', component: resolve => require(['@/components/page/index/Banner.vue'], resolve) },
        { path: '/feature/product', component: resolve => require(['@/components/page/index/FeaturedProduct.vue'], resolve) },
        // 商品管理
        { path: '/product/list', component: resolve => require(['@/components/page/product/Product.vue'], resolve) },
        { path: '/product/add', component: resolve => require(['@/components/page/product/ProductAdd.vue'], resolve) },
        { path: '/product/edit/:id', component: resolve => require(['@/components/page/product/ProductAdd.vue'], resolve) },
        // 品牌分类
        { path: '/product/brand/list', component: resolve => require(['@/components/page/product/Brand.vue'], resolve) },
        { path: '/product/brand/classify_list', component: resolve => require(['@/components/page/product/BrandClassify.vue'], resolve) },
        { path: '/product/brand/add', component: resolve => require(['@/components/page/product/BrandAdd.vue'], resolve) },
        { path: '/product/brand/edit/:id', component: resolve => require(['@/components/page/product/BrandAdd.vue'], resolve) },
        // 规格管理
        { path: '/product/specification/list', component: resolve => require(['@/components/page/product/Specification.vue'], resolve) },
        { path: '/product/specification/add', component: resolve => require(['@/components/page/product/SpecificationAdd.vue'], resolve) },
        { path: '/product/specification/edit/:id', component: resolve => require(['@/components/page/product/SpecificationAdd.vue'], resolve) },
        // 商品分类
        { path: '/product/classify/list', component: resolve => require(['@/components/page/product/Classify.vue'], resolve) },
        { path: '/product/classify/add', component: resolve => require(['@/components/page/product/ClassifyAdd.vue'], resolve) },
        { path: '/product/classify/edit/:id', component: resolve => require(['@/components/page/product/ClassifyAdd.vue'], resolve) },
        // 运费管理
        { path: '/product/express', component: resolve => require(['@/components/page/product/Express.vue'], resolve) },

         // 订单管理
        { path: '/order/list', component: resolve => require(['@/components/page/order/Order.vue'], resolve) },
        { path: '/order/right', component: resolve => require(['@/components/page/order/Right.vue'], resolve) },
        { path: '/order/:id', component: resolve => require(['@/components/page/order/OrderDetail.vue'], resolve) },
        // 地址管理
        { path: '/address/list', component: resolve => require(['@/components/page/address/Address.vue'], resolve) },
        { path: '/address/add', component: resolve => require(['@/components/page/address/AddressAdd.vue'], resolve) },
        { path: '/address/edit/:id', component: resolve => require(['@/components/page/address/AddressAdd.vue'], resolve) },
        
        // 权限管理
        { path: '/right/admin/list', component: resolve => require(['@/components/page/right/Admin.vue'], resolve) },
        { path: '/right/role/list', component: resolve => require(['@/components/page/right/Role.vue'], resolve) },
        { path: '/right/role/add', component: resolve => require(['@/components/page/right/RoleAdd.vue'], resolve) },

        // 网站设置
        { path: '/website/ad', component: resolve => require(['@/components/page/website/Ad.vue'], resolve) },
        { path: '/website/reset', component: resolve => require(['@/components/page/website/Reset.vue'], resolve) },
      ]
    },
    { path: '*', redirect: '/welcome' }
  ]
})
