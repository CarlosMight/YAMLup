import Vue from 'vue'
import Router from 'vue-router'
import LayoutSandbox from '@/layouts/Sandbox'
import LayoutSingleProject from '@/layouts/SingleProject'
import LayoutDeleteProject from '@/layouts/DeleteProject'
import LayoutMyProjects from '@/layouts/MyProjects'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'sandbox',
      path: '/',
      meta: {canSave: true},
      component: LayoutSandbox
    },
    {
      name: 'singleProject',
      path: '/p/:id',
      component: LayoutSingleProject
    },
    {
      name: 'editProject',
      path: '/p/:id/edit',
      meta: {canSave: true},
      component: LayoutSandbox
    },
    {
      name: 'deleteProject',
      path: '/p/:id/delete',
      component: LayoutDeleteProject
    },
    {
      name: 'myProjects',
      path: '/my/projects',
      component: LayoutMyProjects
    }
  ]
})
