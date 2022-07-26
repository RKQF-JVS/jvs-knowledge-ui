<template>
  <div>
    <h3 class="hfm">封面</h3>
    <div class="backCont">
      <div class="back">
        <!-- <img style="margin-top: 45px" src="@/views/info/img/mrbc.png" alt="" /> -->
        <div class="show-back" :style="setInfo.color ? ('background: '+ setInfo.color + ';') : ''">
          <img class="mark" :src="markImg" />
<!--          <img class="desktop" :src="desktopImg" />-->
        </div>
      </div>
      <ul>
        <li
          v-for="item in colorList"
          :key="'color-list-item-' + item"
          :style="'background: ' + item + ';'"
          @click="setColor(item)"
        ></li>
      </ul>
    </div>

    <h3 style="margin-top: 30px">文档名称</h3>
    <jvs-form size="medium" class="banSet" ref="settimgForm" :option="settingFormOption" :formData="setInfo"></jvs-form>
    <h3 style="margin-top: 20px">提醒</h3>
    <el-radio-group v-model="remind" style="margin-bottom: 18px;">
      <el-radio-button :label="true">开启提醒</el-radio-button>
      <el-radio-button :label="false">关闭提醒</el-radio-button>
    </el-radio-group>
<!--    <h3 style="margin-top: 20px">置顶</h3>-->
<!--    <el-radio-group v-model="top" style="margin-bottom: 18px;">-->
<!--      <el-radio-button :label="true">开启置顶</el-radio-button>-->
<!--      <el-radio-button :label="false">关闭置顶</el-radio-button>-->
<!--    </el-radio-group>-->
    <p style="font-size: 12px;">文档发生变更后自动提醒知识库所有成员、管理员、所有者，默认开启所有的文档。</p>
    <h3 style="margin-top: 20px">查看权限</h3>
    <el-radio-group v-model="shareRole" style="margin-bottom: 18px;">
      <el-radio-button label="user">知识库成员查看</el-radio-button>
      <el-radio-button label="register">企业成员可查看</el-radio-button>
      <!-- <el-radio-button label="all">任何人可查看</el-radio-button> -->
    </el-radio-group>
    <div class="notes">
      <span style="color:#409EFF">注：</span>
      <span>知识库成员：由知识库设置里面的人员</span>
      <p>企业成员：当前系统组织结构所有人员</p>
      <!-- <p>任何人：用户可不用登录系统即可查看</p> -->
    </div>
    <div style="text-align: right; margin-top: 40px">
      <el-button v-if="hasRight" class="zsszbtn" type="primary" :loading="saveLoading" @click="saveHandle">保存</el-button>
    </div>
  </div>
</template>

<script>
import mark from '@/views/index/img/mark.png'
import desktop from '@/views/index/img/desktop.png'
import {setLibrary, addLibrary} from './api'
export default {
  props: {
    nodeInfo: {
      type: Object,
    },
    hasRight: {
      type: Boolean
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入内容不能为空'));
      }else if($.trim(value)==''){
        return callback(new Error('输入内容不能为空'));
      }else if(value.length>20){
        return callback(new Error('输入内容不得超过10字'));
      }else{
        callback();
      }
    }
    return {
      top: false,
      remind:true,
      shareRole: 'user',
      markImg: mark,
      desktopImg: desktop,
      // colorList: ["#EEC447", "#F2B344", "#4686FF", "#12D7BF", "#1DC1FE", "#505CE9"],
      colorList: ["#87c3f9", "#c3f2d2", "#80e0ee", "#fba7c6", "#f5e7cf", "#97cdcf"],
      setInfo: {},
      saveLoading: false,
      settingFormOption: {
        cancal: false,
        emptyBtn: false,
        submitBtnText: '保存',
        btnHide: true,
        column: [
          {
            label: '',
            prop: 'name',
            placeholder: '请输入文档名称',
            maxlength: 10,
            rules: [
              { required: true,validator: checkName, trigger: 'blur' },
            ]
          },
          {
            label: '',
            prop: 'description',
            placeholder: '请输入文档介绍',
            type: 'textarea',
            maxlength: 200,
            showwordlimit: true,
            resize: "none",
            rows: 3
          }
        ]
      }
    };
  },
  methods: {
    setColor(color) {
      this.$set(this.setInfo, "color", color);
    },
    saveHandle() {
      this.$refs.settimgForm.$refs.ruleForm.validate((bool, prop, msg) => {
        if(bool) {
          this.saveLoading = true
          this.setInfo.shareRole = this.shareRole
          this.setInfo.readNotify = this.remind
          // this.setInfo.top = this.top
          if(this.subType == 'edit') {
            setLibrary(this.setInfo).then(res => {
              if(res.data.code == 0) {
                this.$notify({
                  title: '设置成功',
                  // message: '右下角弹出的消息',
                  type: 'success',
                  position: 'bottom-right'
                });
                this.saveLoading = false
                this.$emit('close', this.setInfo)
              }
            }).catch(e => {
              this.saveLoading = false
            })
          } else {
            addLibrary(this.setInfo).then(res => {
              if(res.data.code == 0) {
                this.$notify({
                  title: '新增文档成功',
                  // message: '右下角弹出的消息',
                  type: 'success',
                  position: 'bottom-right'
                });
                this.saveLoading = false
                this.$emit('close', this.setInfo)
              }
            }).catch(e => {
              this.saveLoading = false
            })
          }
        }
      })

    },
  },
  created() {
    if (this.nodeInfo && this.nodeInfo.id) {
      this.setInfo = JSON.parse(JSON.stringify(this.nodeInfo));
      this.shareRole =this.setInfo.shareRole
      this.remind=this.setInfo.readNotify
      this.subType = 'edit'
    }else{
      this.subType = 'add'
    }
    this.settingFormOption.disabled = !this.hasRight
  },
};
</script>

<style lang="scss" scoped>
.hfm {
  font-size: 18px;
  margin-top:0!important;
}
.backCont {
  display: flex;
}
/deep/.jvs-form .el-form-item .jvs-form-item,/deep/.el-input,/deep/.el-input .el-input__inner{
  height: 40px!important;
}
.notes{
  font-size: 14px;
  color: #BFBFBF;
  p{
    margin-bottom: 0;
    font-size: 12px;
    margin-left: 2em;
    margin-top: 10px;
  }
  span{
    font-size: 12px;
  }
}
/deep/.el-input--mini .el-textarea__inner{
  resize: none;
}
.back {
  width: 200px;
  height: 150px;
  text-align: center;
  background: #f6f6f6;
  border: 1px solid #ebecee;
  .show-back{
    width: 100%;
    height: 100%;
    background-image: url('../index/img/bg.png');
    background-repeat: no-repeat;
    position: relative;
    img{
      display: block;
    }
    .mark{
      position: absolute;
      left: 5px;
      top: 5px;
      width: 15px;
      height: 20px;
    }
    .desktop{
      width: 80px;
      height: 70px;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
}
ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  width: 300px;
  height: 150px;
  margin: 0;
}
ul li {
  width: 80px;
  height: 60px;
  cursor: pointer;
}
/* .zsszbtn{
    float: right;
    margin-top: 40px;
} */
</style>
