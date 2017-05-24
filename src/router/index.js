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
        

         // 订单管理
        { path: '/order/list', component: resolve => require(['@/components/page/order/Order.vue'], resolve) },
        { path: '/order/right', component: resolve => require(['@/components/page/order/Right.vue'], resolve) },
        { path: '/order/:id', component: resolve => require(['@/components/page/order/OrderDetail.vue'], resolve) },
        // 地址管理
        { path: '/address/list', component: resolve => require(['@/components/page/address/Address.vue'], resolve) },
        { path: '/address/add', component: resolve => require(['@/components/page/address/AddressAdd.vue'], resolve) },
        { path: '/address/edit/:id', component: resolve => require(['@/components/page/address/AddressAdd.vue'], resolve) },
        // 评论管理
        { path: '/comment/:type/:id', component: resolve => require(['@/components/page/Comment.vue'], resolve) },
        // 首页管理
        // { path: '/index/banner', component: resolve => require(['@/components/page/index/Banner.vue'], resolve) },
        { path: '/feature/article', component: resolve => require(['@/components/page/index/FeaturedArticle.vue'], resolve) },
        { path: '/feature/newmedia', component: resolve => require(['@/components/page/index/FeaturedNewmedia.vue'], resolve) },
        { path: '/feature/video', component: resolve => require(['@/components/page/index/FeaturedVideo.vue'], resolve) },
        { path: '/feature/audio', component: resolve => require(['@/components/page/index/FeaturedAudio.vue'], resolve) },
        // 固定栏目
        { path: '/cover/list', component: resolve => require(['@/components/page/column/Cover.vue'], resolve) },
        { path: '/cover/add', component: resolve => require(['@/components/page/column/CoverAdd.vue'], resolve) },
        { path: '/cover/edit/:id', component: resolve => require(['@/components/page/column/CoverAdd.vue'], resolve) },
        { path: '/comics/list', component: resolve => require(['@/components/page/column/Comics.vue'], resolve) },
        { path: '/comics/add', component: resolve => require(['@/components/page/column/ComicsAdd.vue'], resolve) },
        { path: '/comics/edit/:id', component: resolve => require(['@/components/page/column/ComicsAdd.vue'], resolve) },
        { path: '/illustration/list', component: resolve => require(['@/components/page/column/Illustration.vue'], resolve) },
        { path: '/illustration/add', component: resolve => require(['@/components/page/column/IllustrationAdd.vue'], resolve) },
        { path: '/illustration/edit/:id', component: resolve => require(['@/components/page/column/IllustrationAdd.vue'], resolve) },
        // 栏目文章
        { path: '/column/list', component: resolve => require(['@/components/page/article/Column.vue'], resolve) },
        { path: '/author/list', component: resolve => require(['@/components/page/article/Author.vue'], resolve) },
        { path: '/article/list', component: resolve => require(['@/components/page/article/Article.vue'], resolve) },
        { path: '/article/add', component: resolve => require(['@/components/page/article/ArticleAdd.vue'], resolve) },
        { path: '/article/edit/:id', component: resolve => require(['@/components/page/article/ArticleAdd.vue'], resolve) },
        // 视频管理
        { path: '/video/category', component: resolve => require(['@/components/page/video/Category.vue'], resolve) },
        { path: '/video/list', component: resolve => require(['@/components/page/video/Video.vue'], resolve) },
        { path: '/video/add', component: resolve => require(['@/components/page/video/VideoAdd.vue'], resolve) },
        { path: '/video/banner', component: resolve => require(['@/components/page/video/Banner.vue'], resolve) },
        { path: '/video/edit/:id', component: resolve => require(['@/components/page/video/VideoAdd.vue'], resolve) },
        // 音频管理
        { path: '/audio/category', component: resolve => require(['@/components/page/audio/Category.vue'], resolve) },
        { path: '/audio/list', component: resolve => require(['@/components/page/audio/Audio.vue'], resolve) },
        { path: '/audio/add', component: resolve => require(['@/components/page/audio/AudioAdd.vue'], resolve), },
        { path: '/audio/edit/:id', component: resolve => require(['@/components/page/audio/AudioAdd.vue'], resolve), },
        // 新媒体管理
        { path: '/newmedia/category', component: resolve => require(['@/components/page/newmedia/Category.vue'], resolve) },
        { path: '/newmedia/list', component: resolve => require(['@/components/page/newmedia/Article.vue'], resolve) },
        { path: '/newmedia/add', component: resolve => require(['@/components/page/newmedia/ArticleAdd.vue'], resolve) },
        { path: '/newmedia/banner', component: resolve => require(['@/components/page/newmedia/Banner.vue'], resolve) },
        { path: '/newmedia/edit/:id', component: resolve => require(['@/components/page/newmedia/ArticleAdd.vue'], resolve) },
        // 图书管理
        { path: '/book/list', component: resolve => require(['@/components/page/book/Book.vue'], resolve) },
        { path: '/book/add', component: resolve => require(['@/components/page/book/BookAdd.vue'], resolve) },
        { path: '/book/edit/:id', component: resolve => require(['@/components/page/book/BookAdd.vue'], resolve) },
        // 活动管理
        { path: '/activity/list', component: resolve => require(['@/components/page/activity/Activity.vue'], resolve) },
        { path: '/activity/add', component: resolve => require(['@/components/page/activity/ActivityAdd.vue'], resolve) },
        { path: '/activity/category', component: resolve => require(['@/components/page/activity/Category.vue'], resolve) },
        { path: '/activity/banner', component: resolve => require(['@/components/page/activity/Banner.vue'], resolve) },
        { path: '/activity/edit/:id', component: resolve => require(['@/components/page/activity/ActivityAdd.vue'], resolve) },
        // 网站设置
        { path: '/website/ad', component: resolve => require(['@/components/page/website/Ad.vue'], resolve) },
        { path: '/website/admin', component: resolve => require(['@/components/page/website/Admin.vue'], resolve) },
        { path: '/website/job', component: resolve => require(['@/components/page/website/Job.vue'], resolve) },
        { path: '/website/partner', component: resolve => require(['@/components/page/website/Partner.vue'], resolve) },
        { path: '/website/reset', component: resolve => require(['@/components/page/website/Reset.vue'], resolve) },
        { path: '/website/subscription', component: resolve => require(['@/components/page/website/subscription.vue'], resolve) },
      ]
    },
    { path: '*', redirect: '/welcome' }
  ]
})
