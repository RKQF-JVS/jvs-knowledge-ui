<template>
  <div class="user-info-list">
    <div>
      <el-input size="mini" placeholder="请选择用户" :disabled="disableBool" v-model="userStr" class="input-with-select" @focus="enableinputHandle">
        <div slot="append" v-if="!disableBool">
          <jvs-button icon="el-icon-search" type="info" :disabled="disableBool" @click="openDialog"></jvs-button>
          <jvs-button icon="el-icon-delete" type="warning" :disabled="disableBool" @click="clearUser"></jvs-button>
        </div>
      </el-input>
    </div>
    <userSeletor ref="userSelector" :autoClose="true" :selectable="selectable" @submit="submit" @cancel="cancel"></userSeletor>
  </div>
</template>

<script>
import userSeletor from './userSelector'
export default {
  name: "user-info-list",
  components: { userSeletor },
  props: {
    form: {
      type: Object
    },
    prop: {
      type: String
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    defaultValue: {
      type: String
    },
    enableinput: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean
    },
    resetRadom: {
      type: Number
    }
  },
  computed: {},
  filters: {
    formatRoleName (list) {
      let str = ''
      if(list) {
        str = list.join(',')
      }
      return str
    }
  },
  data () {
    return {
      userStr: '',
      userList: [],
      userNameList: [],
      disableBool: false
    }
  },
  methods: {
    submit (list) {
      if(this.selectable) {
        this.selectChange(list)
        this.userStr = this.userNameList.join(',')
        this.form[this.prop] = this.userList
      }else{
        if(list && list.length > 0) {
          this.form[this.prop] = list[0].id
          this.userStr = list[0].realName
        }
      }
      this.$emit('change', this.form)
    },
    selectChange (data) {
      let temp = []
      let nm = []
      for(let i in data) {
        temp.push(data[i].id)
        nm.push(data[i].realName)
      }
      this.userList = temp
      this.userNameList = nm
    },
    cancel (bool) {
      this.$emit('cancel', bool)
    },
    openDialog () {
      this.$refs.userSelector.openDialog()
    },
    enableinputHandle () {
      if(this.enableinput === false) {
        this.openDialog()
      }
    },
    clearUser () {
      this.userStr = ""
      if(this.selectable) {
        this.form[this.prop] = []
      }else{
        this.form[this.prop] = null
      }
      this.$emit('change', this.form)
    }
  },
  mounted () {},
  created () {
    if(this.disabled === true) {
      this.disableBool = true
    }
  },
  watch: {
    defaultValue: {
      handler (newVal, oldVal) {
        this.userStr = newVal
        if(newVal != '') {
          this.disableBool = true
        }else{
          this.disableBool = false
        }
        this.$forceUpdate()
      }
    },
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.getList(true)
        }
      }
    }
  },
};
</script>

<style lang="scss">
.user-info-box{
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  .user-dept-tree{
    width: 150px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  .user-dept-tree::-webkit-scrollbar{
    display: none;
  }
  .user-table{
    flex: 1;
    margin-left: 10px;
    width: calc(100% - 200px);
    box-sizing: border-box;
    .el-card{
      box-shadow: none;
      border: 0;
    }
    .el-card__body{
      border: 0;
    }
    .table-body-box{
      height: calc(100% - 130px);
      overflow: hidden;
      .el-table{
        height: 100%;
        box-sizing: border-box;
       .el-table__body-wrapper{
         height: calc(100% - 75px)!important;
       }
       .el-table__header-wrapper{
         margin-top: 0;
       }
      }
    }
    .tablepagination{
      .el-pagination__sizes{
        .el-input__suffix{
          .el-input__icon.el-input__validateIcon{
            display: none;
          }
        }
      }
    }
  }
}

.table-form .jvs-table .el-table{
  .user-info-list{
    .input-with-select{
      flex-wrap: nowrap!important;
      .el-input__inner{
        width: calc(100% - 75px);
      }
      .el-input-group__append{
        display: table-cell!important;
        width: 82px;
        padding: 0;
        div{
          display: block!important;
          width: 100%;
          line-height: 26px;
        }
      }
    }
  }
}
.user-info-list-dialog{
  .el-dialog.is-fullscreen{
    position: relative;
    .el-dialog__header{
      padding: 0;
      height: 45px;
      display: flex;
      align-items: center;
      .el-dialog__title{
        font-size: 18px;
        font-weight: 600;
        margin-left: 30px;
        position: relative;
        padding-left: 20px;
      }
      .el-dialog__title::before{
        position: absolute;
        content: "";
        width: 4px;
        height: 18px;
        background: #3471ff;
        border-radius: 2px;
        cursor: pointer;
        left: 0;
        top: 4px;
        cursor: auto;
      }
      .el-dialog__headerbtn{
        top: 12px;
      }
    }
    .el-dialog__body{
      padding: 8px 10px;
      height: calc(100% - 45px);
      box-sizing: border-box;
      overflow: hidden;
      background: #F0F2F5;
      .el-form{
        .el-form-item{
          .el-form-item__label-wrap{
            .el-form-item__label{
              font-size: 14px;
            }
            .el-form-item__content{
              font-size: 14px;
            }
          }
          .el-button{
            font-size: 12px;
            // background-color: #409eff;
            // color: #fff;
            // border-color: #409eff;
          }
          .el-button--primary{
            background-color: #409eff;
            color: #fff;
          }
        }
      }
    }
  }
}
.el-form-item.is-error{
  .user-info-list{
    .el-input-group__append{
      border-color: #F56C6C;
      .el-button{
        color: #F56C6C;
      }
    }
  }
}
</style>