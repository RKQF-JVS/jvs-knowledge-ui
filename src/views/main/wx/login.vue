<template>
  <div></div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(["tagWel"])
  },
  data () {
    return {}
  },
  created () {
    if(this.$route.query) {
      let query = this.$route.query
      query.loginType = 'weixin'
      if(query) {
        this.$store.dispatch("LoginByUsername", Object.assign({}, query)).then((data) => {
          localStorage.setItem('loginRandom', '')
          this.getTenantByUserList(data)
        }).catch(() => {
          this.$router.push({ path: '/index' });
        })
      }
    }
  },
  methods: {
    // 获取该用户下所有的租户列表
    getTenantByUserList (data) {
      // console.log(data)
      let list = []
      if(data.userDto && data.userDto.tenants) {
        list = data.userDto.tenants
        if(list.length > 0) {
          // 只有一个租户直接进去
          if(list.length == 1) {
            this.$store.commit("SET_SwitchTenant", false)
            this.setUserInfoData(data)
          }else{
            this.$store.commit("SET_SwitchTenant", true)
            this.switchTenant(list)
          }
        }
      }
    },
    // 加入成功后写入数据
    setUserInfoData (data) {
      if(data) {
        this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
        this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
        this.$store.commit("SET_EXPIRES_IN", data.expires_in);
        this.$store.commit("CLEAR_LOCK");
        this.$store.commit("SET_USER_INFO", data.userDto);
        this.$store.commit("SET_ROLES", data.roles || []);
        this.$store.commit("SET_PERMISSIONS", data.permissions || []);
        this.$store.commit("SET_TENANTId", data.userDto.tenantId);
        this.$store.commit("DEL_ALL_TAG"); // 关闭之前打开的所有tag
        this.$store.commit("SET_THEME_NAME", ""); // 清除主题
        this.$store.commit("SET_TENANTINFO", data.userDto.tenant)

        this.$router.push({ path: '/index' });
      }   
    },
    // 选择租户登录
    switchTenant (list) {
      this.$openLogin({
        successClose: false,
        switchTenant: true,
        switchList: list,
        afterLogin: (dialog, res) => {
          dialog.handleClose()
          this.$router.push({ path: '/index' });
        }
      })
    }
  }
}
</script>