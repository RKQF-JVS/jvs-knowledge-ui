<template>
  <jvs-tab :active="activeName" type="card" :option="levelFormOption">
    <template v-for="item in levelFormOption.column" :slot="item.name">
      <jvs-form v-if="item.formOption" :key="item.name+'level'" :defalutFormData="item.defaultData" :option="item.formOption"></jvs-form>
    </template>
  </jvs-tab>
</template>
<script>
export default {
  name: 'jvs-form-level',
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
      activeName: 'form1',
      levelFormOption: {},
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
      this.levelFormOption = this.option
      this.activeName = this.option.column[0].name
    }else{
      this.levelFormOption = this.defaultSet
      this.activeName = this.option.column[0].name
    }
  },
}
</script>
<style lang="scss">
</style>