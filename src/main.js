// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import EventBus from '@/util/bus'
import PostSingle from '@/components/project/Single'
import Spinner from '@/components/Spinner'
import Toasted from 'vue-toasted'
import router from '@/router.js'
import store from '@/store'

require('@/util/sandbox')

Vue.config.productionTip = false
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: () => EventBus
  }
})

Vue.use(Toasted)

Vue.component('project-single', PostSingle)
Vue.component('spinner', Spinner)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
