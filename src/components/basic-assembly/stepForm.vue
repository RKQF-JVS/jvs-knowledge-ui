<template>
  <jvs-tab :active="activeName" type="card" :option="stepFormOption" @tab-click="tabClick">
    <template v-for="(item, index) in stepFormOption.column" :slot="item.name">
      <jvs-form v-if="item.formOption" :key="item.name+'level'" :defalutFormData="item.defaultData" :option="item.formOption" @submit="submitHandle">
        <template slot="formButton">
          <jvs-button v-if="index > 0" @click="lastStep(index)">上一步</jvs-button>
        </template>
      </jvs-form>
    </template>
  </jvs-tab>
</template>
<script>
export default {
  name: 'jvs-form-step',
  props: {
    active: {
      type: String,
      default: ''
    },
    // 选项卡配置
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      activeName: '',
      stepFormOption: {},
      defaultSet: {
        column: [
          {
            label: '表单一',
            name: 'form1',
            defaultData: {}, // 表单默认值
            formOption: {
              column: [
                {
                  label: '文本框',
                  prop: 'input'
                }
              ]
            }
          }
        ]
      }
    }
  },
  created () {
    if(this.active) {
      this.activeName = this.active
    }
    if(this.option) {
      this.stepFormOption = this.option
      this.activeName = this.option.column[0].name
    }else{
      this.stepFormOption = this.defaultSet
      this.activeName = this.defaultSet.column[0].name
    }
    // 全部设置disable
    for(let i in this.stepFormOption.column) {
      this.stepFormOption.column[i].disabled = true
    }
  },
  methods: {
    // tab切换
    tabClick (tab) {
      this.activeName = tab
    },
    // 上一步
    lastStep (index) {
      index = Number.parseInt(index)
      this.activeName = this.stepFormOption.column[index-1].name
      this.$forceUpdate()
    },
    // 提交，下一步
    submitHandle (form) {
      if(form) {
        // 数据操作
        // 下一步
        let index = this.getIndexOfForm(this.activeName)
        this.stepFormOption.column[index].disabled = false
        if(index == this.stepFormOption.column.length - 1) {
          this.activeName = this.stepFormOption.column[index].name
        }else{
          this.activeName = this.stepFormOption.column[index+1].name
        }
      }
    },
    getIndexOfForm (active) {
      for(let i in this.stepFormOption.column) {
        if(this.stepFormOption.column[i].name == active) {
          return Number.parseInt(i)
        }
      }
      return -1
    }
  }
}
</script>
<style lang="scss">
</style>