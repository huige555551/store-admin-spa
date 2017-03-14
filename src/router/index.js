import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home'
import Login from '@/components/page/Login'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/welcome',
      component: Home,
      /* eslint-disable */
      children: [
        { path: '/', component: resolve => require(['@/components/page/Welcome'], resolve) },

        { path: '/user/list', component: resolve => require(['@/components/page/User.vue'], resolve) },

        { path: '/index/banner', component: resolve => require(['@/components/page/index/Banner.vue'], resolve) },
        { path: '/index/feature', component: resolve => require(['@/components/page/index/Feature.vue'], resolve) },

        { path: '/magazine/list', component: resolve => require(['@/components/page/column/Magazine.vue'], resolve) },
        { path: '/magazine/add', component: resolve => require(['@/components/page/column/MagazineAdd.vue'], resolve) },
        { path: '/comics/list', component: resolve => require(['@/components/page/column/Comics.vue'], resolve) },
        { path: '/comics/add', component: resolve => require(['@/components/page/column/ComicsAdd.vue'], resolve) },
        { path: '/illustration/list', component: resolve => require(['@/components/page/column/Illustration.vue'], resolve) },
        { path: '/illustration/add', component: resolve => require(['@/components/page/column/IllustrationAdd.vue'], resolve) },

        { path: '/column/list', component: resolve => require(['@/components/page/article/Column.vue'], resolve) },
        { path: '/author/list', component: resolve => require(['@/components/page/article/Author.vue'], resolve) },
        { path: '/article/list', component: resolve => require(['@/components/page/article/Article.vue'], resolve) },
        { path: '/article/add', component: resolve => require(['@/components/page/article/ArticleAdd.vue'], resolve) },

        { path: '/video/category', component: resolve => require(['@/components/page/video/Category.vue'], resolve) },
        { path: '/video/list', component: resolve => require(['@/components/page/video/Video.vue'], resolve) },
        { path: '/video/add', component: resolve => require(['@/components/page/video/VideoAdd.vue'], resolve) },
        { path: '/video/banner', component: resolve => require(['@/components/page/video/Banner.vue'], resolve) },

        { path: '/audio/category', component: resolve => require(['@/components/page/audio/Category.vue'], resolve) },
        { path: '/audio/list', component: resolve => require(['@/components/page/audio/Audio.vue'], resolve) },
        { path: '/audio/add', component: resolve => require(['@/components/page/audio/AudioAdd.vue'], resolve) },

        { path: '/newmedia/category', component: resolve => require(['@/components/page/newmedia/Category.vue'], resolve) },
        { path: '/newmedia/list', component: resolve => require(['@/components/page/newmedia/Article.vue'], resolve) },
        { path: '/newmedia/add', component: resolve => require(['@/components/page/newmedia/ArticleAdd.vue'], resolve) },
        { path: '/newmedia/banner', component: resolve => require(['@/components/page/newmedia/Banner.vue'], resolve) },

        { path: '/book/list', component: resolve => require(['@/components/page/book/Book.vue'], resolve) },
        { path: '/book/add', component: resolve => require(['@/components/page/book/BookAdd.vue'], resolve) },

        { path: '/activity/list', component: resolve => require(['@/components/page/activity/Activity.vue'], resolve) },
        { path: '/activity/add', component: resolve => require(['@/components/page/activity/ActivityAdd.vue'], resolve) },
        { path: '/activity/category', component: resolve => require(['@/components/page/activity/Category.vue'], resolve) },
        { path: '/activity/banner', component: resolve => require(['@/components/page/activity/Banner.vue'], resolve) },

        { path: '/website/ad', component: resolve => require(['@/components/page/website/Ad.vue'], resolve) },
        { path: '/website/job', component: resolve => require(['@/components/page/website/Job.vue'], resolve) },
        { path: '/website/partner', component: resolve => require(['@/components/page/website/Partner.vue'], resolve) },
      ]
    },
    { path: '/login', component: Login }
  ]
})
