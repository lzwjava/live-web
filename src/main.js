import Vue from 'vue'
import Router from 'vue-router'
import Ajax from 'vue-resource'

import filters from './filters'
import App from './views/App.vue'
import HomeView from './views/HomeView.vue'
import EditView from './views/EditView.vue'
import ManageView from './views/ManageView.vue'
import ListView from './views/ListView.vue'
import LiveView from './views/LiveView.vue'
import AttendedListView from './views/AttendedListView.vue'

// install router
Vue.use(Router)

// register filters globally

for(let  k in filters){
    Vue.filter(k, filters[k])
}

// http
Vue.config.debug = true;
Vue.use(Ajax);
Vue.http.options.root = '/api';
Vue.http.options.emulateJSON = true;
Vue.http.options.timeout = 1000 * 10;

console.log('env ' + process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  localStorage.debug = ''
} else {
  localStorage.debug = 'HomeView,EditView,markdown-area,nav,util,ManageView,api,LiveView';
}

// routing
var router = new Router()

router.map({
  '/': {
    component: HomeView
  },
  '/edit/:liveId' : {
    component: EditView
  },
  '/manage/:liveId': {
    component: ManageView
  },
  '/mylist': {
    component: ListView
  },
  '/lives/:liveId': {
    component: LiveView
  },
  '/attendedList': {
    component: AttendedListView
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
