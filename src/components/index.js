import Vue from 'vue'
import basicContainer from './basic-container/main'
import jvsForm from './basic-assembly/form'
import jvsTable from './basic-assembly/table'
import jvsTab from './basic-assembly/tab'
import jvsButton from './basic-assembly/button'
import jvsFormLevel from './basic-assembly/levelForm'
import jvsFromStep from './basic-assembly/stepForm'
import titlePageHeader from './page-header/titlePageHeader'

// 注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('jvs-form', jvsForm)
Vue.component('jvs-table', jvsTable)
Vue.component('jvs-tab', jvsTab)
Vue.component('jvs-button', jvsButton)
Vue.component('jvs-form-level', jvsFormLevel)
Vue.component('jvs-form-step', jvsFromStep)
Vue.component('title-page-header', titlePageHeader)