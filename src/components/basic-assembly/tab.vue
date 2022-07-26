<template>
  <el-tabs
    v-model="activeName"
    :type="option.type || defaultOption.type"
    :tab-position="option.tabPosition || defaultOption.tabPosition"
    :stretch="option.stretch || defaultOption.stretch"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="item in option.column"
      :key="item.name"
      :label="item.label"
      :disabled="item.disabled"
      :name="item.name"
      :lazy="item.lazy"
    >
      <el-form
        :model="forms[item.name]"
        :ref="formRef || 'ruleForm'"
        class="demo-dynamic"
        size='mini'
        :label-position="(originOption && originOption.formAlign) || defalutSet.option.formAlign"
        :label-width="(originOption && originOption.labelWidth) || defalutSet.option.labelWidth"
        :disabled='(originOption && originOption.disabled)'
      >
        <el-row v-if="formItem.column && formItem.column[item.name] && formItem.column[item.name].length > 0" style="width:100%;">
          <el-col
            v-for="it in formItem.column[item.name]"
            :key="it.prop"
            :span="it.span || 24"
            v-show="it.display == false ? it.display : true"
            :class="{'no-label-form-item': it.hideLabel}"
          >
            <!-- 一般项 -->
            <el-form-item
              v-if="(it.type !='title' && (!it.children || it.children.length == 0) || it.type == 'formbox') && $permissionMatch(it.permisionFlag) && (it.display == false ? it.display : true)"
              :label="it.label"
              :prop='it.prop'
              :rules='it.rules'
              v-model="forms[item.name][it.prop]"
              :label-width="it.type==='iframe'?'0':((originOption && originOption.labelWidth) || defalutSet.option.labelWidth)"
              :class='{"form-item-no-label": ( (!it.label && it.type != "tab") || (["tableForm","divider","p","section"].indexOf(it.type) > -1) ), "form-item-no-label-tab": (!it.label && it.type == "tab")}'
            >
              <FormItem  :item="it" :form="forms[item.name]"
                :originOption="originOption"
                :defalutSet="defalutSet"
                :userList="userList"
                :resetRadom="resetRadom"
                @formChange="formChange" />
            </el-form-item>
            <!-- 子表单项 -->
            <el-row v-if="it.type != 'formbox' && it.children && it.children.length > 0">
              <el-form-item
                :label="it.label"
                :prop="it.prop"
                :rules="it.rules"
                v-if="(it.display == false ? it.display : true)"
                v-model="forms[item.name][it.prop]"
                :class='(!it.label || (["tableForm","divider","p","tab","section"].indexOf(it.type) > -1))? "form-item-no-label" : ""'
              >
                <FormItem
                  v-if="!it.formSlot"
                  :form="forms[item.name]"
                  :item="it"
                  :originOption="originOption"
                  :defalutSet="defalutSet"
                  @formChange="formChange"
                  :userList="userList"
                  :resetRadom="resetRadom"
                />
                <!-- 自定义列插槽 -->
                <div v-if="it.formSlot">
                  <slot :name="it.prop+'Form'"></slot>
                  <!-- 右侧提示 -->
                  <el-tooltip
                    v-if="it.tips && it.tips.position == 'right' && it.tips.text"
                    class="form-item-tooltip"
                    effect="dark"
                    :content="it.tips.text"
                    placement="top"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <!-- 换行提示 -->
                <el-row
                  v-if="it.tips && it.tips.position == 'bottom'"
                  class="form-item-tips"
                >
                  <span v-html="it.tips.text"></span>
                </el-row>
              </el-form-item>
              <el-col
                v-for="itc in it.children"
                :key="itc.prop"
                :span="itc.span || originOption.span || 24"
              >
                <el-form-item
                  :label="itc.label"
                  :prop="itc.prop"
                  v-if="itc.display === false ? false : linkbindHandle(forms[item.name][it.prop], itc.linkbind)"
                  :rules="itc.rules"
                  v-model="forms[item.name][itc.prop]"
                  :class='{"form-item-no-label": (!itc.label || (["tableForm","divider","p","tab","section"].indexOf(itc.type) > -1))}'
                >
                  <FormItem
                    v-if="!itc.formSlot"
                    :form="forms[item.name]"
                    :item="itc"
                    :formRef="defalutSet.refs"
                    :originOption="originOption"
                    :defalutSet="defalutSet"
                    @formChange="formChange"
                    :userList="userList"
                    :resetRadom="resetRadom"
                  />
                  <!-- 自定义列插槽 -->
                  <div v-if="itc.formSlot">
                    <slot :name="itc.prop+'Form'"></slot>
                    <!-- 右侧提示 -->
                    <el-tooltip
                      v-if="itc.tips && itc.tips.position == 'right' && itc.tips.text"
                      class="form-item-tooltip"
                      effect="dark"
                      :content="itc.tips.text"
                      placement="top"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                  <!-- 换行提示 -->
                  <el-row
                    v-if="itc.tips && itc.tips.position == 'bottom'"
                    class="form-item-tips"
                  >
                    <span v-html="itc.tips.text"></span>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <slot :name="item.name"></slot>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import FormItem from './formitem'
export default {
  name: "jvs-tab",
  components: {FormItem},
  props: {
    // 绑定值，选中选项卡的 name
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
    },
    // 表单传递对象
    forms: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单结构对象
    formItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formRef: {
      type: String,
      default: 'ruleForm'
    },
    originOption: {
      type: Object
    },
    // 用户列表
    userList : {
      type: Array,
      default: () => {
        return []
      }
    },
    resetRadom: {
      type: Number
    }
  },
  data () {
    return {
      activeName: '',
      defaultOption: {
        type: '', // tab风格， card/border-card
        tabPosition: 'top', // 选项卡所在位置, top/right/bottom/left
        stretch: false, // 标签的宽度是否自撑开
        column: [
          {
            label: '', // 选项卡标题
            disabled: false, // 是否禁用
            name: '', // 与选项卡绑定值 value 对应的标识符，表示选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
            lazy: false, // 标签是否延迟渲染
            permisionFlag: '', // 权限标识
          }
        ]
      },
      defalutSet: {
        refs: 'ruleForm',
        option: {
          formAlign: 'right', //对其方式
          inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
          labelWidth: 'auto', // label宽
          searchBtn: true, // 搜索按钮是否显示，默认显示
          searchBtnText: '查询', // 搜索按钮，默认查询
          submitBtn: true, // 提交按钮是否显示，默认显示
          submitBtnText: '提交', // 提交按钮文字，默认 提交
          emptyBtn: true, // 重置按钮，默认显示
          emptyBtnText: '重置', // 重置按钮文字，默认 重置
          cancalBtnText: '取消', // 取消按钮文字， 默认 取消
        }
      },
      initData: ""
    }
  },
  created () {
    this.dealPermission()
    if(this.active) {
      this.activeName = this.active
    }
    this.initData = JSON.stringify(this.forms)
  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name
      this.$emit('tab-click', tab.name)
    },
    // 处理权限
    dealPermission () {
      for(let i in this.option.column) {
        if(!this.option.column[i].permisionFlag) {
          this.option.column[i].show = true
        }else{
          this.option.column[i].show = this.$permissionMatch(this.option.column[i].permisionFlag)
        }
        // 加入自定义校验
        if(this.formItem && this.formItem.column) {
          let tcol = this.formItem.column[this.option.column[i].name]
          if(tcol && tcol.length > 0) {
            for(let t in tcol) {
              if(tcol[t].regularExpression){
                let required = false
                if(tcol[t].rules && tcol[t].rules[0].required) {
                  required = true
                }
                let str = '/' + tcol[t].regularExpression + '/'
                let _this = this
                tcol[t].rules.push({
                  validator: function(rule, value, callback) {
                    if(eval(str).test(value)) {
                      callback()
                    }else{
                      let msg = '正则校验不通过'
                      if(tcol[t].regularMessage) {
                        msg = tcol[t].regularMessage
                      }
                      if(required == false && !value) {
                        callback()
                      }else{
                        callback(new Error(msg));
                      }
                    }
                  },
                  trigger: ['blur', 'change']
                })
              }
            }
          }
        }
      }
      this.option.column = this.option.column.filter(item => item.show)
    },
    // 值变化
    formChange (form) {
      this.$set(this.forms, this.activeName, form)
      this.$forceUpdate()
      this.$emit('formChange', this.forms)
    },
    // 联动控制
    linkbindHandle (val, bind) {
      let bool = true
      if(bind) {
        if(val) {
          let arr = bind.split(',')
          if(val instanceof Array) {
            let tb = false
            for(let i in val) {
              if(arr.indexOf(val[i]) > -1) {
                tb = true
              }
            }
            bool = tb
          }else{
            if(arr.indexOf(val) > -1) {
              bool = true
            }else{
              bool = false
            }
          }
        }
      }
      return bool
    }
  },
  watch: {
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          if(this.initData.startsWith('{')) {
            let temp = JSON.parse(this.initData)
            for(let i in this.option.column) {
              this.$set(this.forms, this.option.column[i].name, temp[this.option.column[i].name])
            }
          }
        }
      }
    }
  }
}
</script>
