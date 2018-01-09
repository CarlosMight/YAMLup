import Vue from 'vue'
import Router from 'vue-router'
import LayoutSandbox from '@/layouts/Sandbox'
import LayoutSingleProject from '@/layouts/LayoutSingleProject'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LayoutSandbox
    },
    {
      path: '/p/:id',
      component: LayoutSingleProject
    }
  ]
})
