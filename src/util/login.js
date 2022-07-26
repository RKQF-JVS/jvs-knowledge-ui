/**
 * wyQAQ
 * 1396871452@qq.com
 */
import Vue from 'vue'
import loginForm from '@/components/basic-container/login/loginForm.vue'
const loginFormBox = Vue.extend(loginForm)
loginForm.install = function (data) {
  let instance = new loginFormBox({data})
  instance.$store = this.$root.$store
  instance.$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.init()
  })
}

export default loginForm