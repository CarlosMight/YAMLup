// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router.js'
import EventBus from '@/util/bus'
import PostSingle from '@/components/project/Single'

Vue.config.productionTip = false
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: () => EventBus
  }
})

Vue.component('project-single', PostSingle)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
