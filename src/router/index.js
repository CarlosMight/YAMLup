import Vue from 'vue'
import Router from 'vue-router'
import LayoutSandbox from '@/layouts/Sandbox'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LayoutSandbox
    }
  ]
})
