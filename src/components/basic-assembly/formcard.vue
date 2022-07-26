<template>
  <div class="form-card">
    <el-tabs :class="{'no-data-tab': (!tabData || tabData.length == 0)}" v-model="activeName" type="card" editable @edit="handleTabsEdit">
      <el-tab-pane
        v-for="(item, index) in tabData"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
      <el-form
        v-if="forms && index < forms.length"
        :model="forms[index]"
        :ref="formRef || 'ruleForm'"
        class="demo-dynamic"
        size='mini'
        :label-position="originOption.formAlign || defalutSet.option.formAlign"
        :label-width="originOption.labelWidth || defalutSet.option.labelWidth"
        :disabled='originOption.disabled'
        >
          <el-row v-if="formItem.children && formItem.children.length > 0" style="width:100%;">
            <el-col
              v-for="it in formItem.children"
              :key="'formcard'+index+it.prop"
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
                v-model="forms[index][it.prop]"
                :label-width="it.type==='iframe'?'0':(originOption.labelWidth || defalutSet.option.labelWidth)"
                :class='{"form-item-no-label": ( (!it.label && it.type != "tab") || (["tableForm","divider","p","section"].indexOf(it.type) > -1) ), "form-item-no-label-tab": (!it.label && it.type == "tab")}'
              >
                <FormItem
                  :item="it"
                  :form="forms[index]"
                  :reinitFlag="reinitFlag"
                  :originOption="originOption"
                  :defalutSet="defalutSet"
                  :roleOption="roleOption"
                  :userList="userList"
                  :departmentList="departmentList"
                  :postList="postList"
                  :resetRadom="resetRadom"
                  @formChange="formChange"
                />
              </el-form-item>
              <!-- 子表单项 -->
              <el-row v-if="it.type != 'formbox' && it.children && it.children.length > 0">
                <el-form-item
                  :label="it.label"
                  :prop="it.prop"
                  :rules="it.rules"
                  v-if="(it.display == false ? it.display : true)"
                  v-model="forms[index][it.prop]"
                  :class='(!it.label || (["tableForm","divider","p","tab","section"].indexOf(it.type) > -1))? "form-item-no-label" : ""'
                >
                  <FormItem
                    v-if="!it.formSlot"
                    :form="forms[index]"
                    :reinitFlag="reinitFlag"
                    :item="it"
                    :originOption="originOption"
                    :defalutSet="defalutSet"
                    @formChange="formChange"
                    :roleOption="roleOption"
                    :userList="userList"
                    :departmentList="departmentList"
                    :postList="postList"
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
                  :key="itc.prop+'formcard-contrl-item'"
                  :span="itc.span || originOption.span || 24"
                >
                  <el-form-item
                    :label="itc.label"
                    :prop="itc.prop"
                    v-if="itc.display === false ? false : linkbindHandle(forms[index][it.prop], itc.linkbind)"
                    :rules="itc.rules"
                    v-model="forms[index][itc.prop]"
                    :class='(!itc.label || (["tableForm","divider","p","tab","section"].indexOf(itc.type) > -1))? "form-item-no-label" : ""'
                  >
                    <FormItem
                      v-if="!itc.formSlot"
                      :form="forms[index]"
                      :item="itc"
                      :formRef="defalutSet.refs"
                      :originOption="originOption"
                      :defalutSet="defalutSet"
                      @formChange="formChange"
                      :roleOption="roleOption"
                      :userList="userList"
                      :departmentList="departmentList"
                      :postList="postList"
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
  </div>
</template>
<script>
export default {
  name: 'card-form',
  components: {
    FormItem: () => import('@/components/basic-assembly/formitem')
  },
  props: {
    // 表单传递对象
    forms: {
      type: Array,
      default: () => {
        return []
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
    // 角色列表
    roleOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 部门列表
    departmentList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 岗位列表
    postList: {
      type: Array,
      default: () => {
        return []
      }
    },
    resetRadom: {
      type: Number
    }
  },
  data() {
    return {
      activeName: '0',
      tabIndex: 0,
      tabData: [],
      reinitFlag: -1,
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
    }
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.tabData.push({
          title: this.formItem.label ? (this.formItem.label + (this.tabData.length+1)) : ('表单卡片' + (this.tabData.length+1) ),
          name: newTabName
        });
        this.activeName = newTabName;
        this.forms.push({})
        this.reinitFlag = Math.random()
        this.$forceUpdate()
      }
      if (action === 'remove') {
        let tabs = this.tabData;
        let activeName = this.activeName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.activeName = activeName;
        this.tabData = tabs.filter(tab => tab.name !== targetName);
        for(let i in this.tabData) {
          i = Number.parseInt(i)
          this.tabData[i].title = this.formItem.label ? (this.formItem.label + (i+1)) : ('表单卡片' + (i+1) )
        }
      }
    },
    formChange (form) {
      let index = -1
      for(let i in this.tabData) {
        if(this.tabData[i].name == this.activeName) {
          index = i
        }
      }
      if(index > -1) {
        this.$set(this.forms, index, form)
        this.$forceUpdate()
        this.$emit('formChange', this.forms)
      }
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
    },
    init () {
      this.tabData = []
      if(this.forms && this.forms.length > 0) {
        for(let i in this.forms) {
          this.tabData.push({
            name: (Number.parseInt(i)+1) + "",
            title: this.formItem.label ? (this.formItem.label + (Number.parseInt(i)+1)) : ('表单卡片' + (Number.parseInt(i)+1) )
          })
        }
        this.activeName = '1'
      }
      let tcol = this.formItem.children
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
  },
  created () {
    this.init()
  },
  watch: {
    resetRadom: {
      handler (newVal , oldVal) {
        if(newVal > -1) {
          this.init()
        }
      }
    }
  }
}
</script>
<style lang="scss">
.form-card{
  width: 100%;
  .el-tabs--card.no-data-tab>.el-tabs__header{
    border-color: #fff;
    .el-tabs__nav{
      border-color: #fff;
    }
  }
}
</style>
