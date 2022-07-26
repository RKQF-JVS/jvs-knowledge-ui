<template>
  <div class="jvs-form-item" style="display:flex;align-items:center;">
    <el-input
      v-model="forms[item.prop]"
      v-if='item.type==="input" || !item.type'
      :show-word-limit="item.showwordlimit"
      :minlength="item.minlength"
      :maxlength="item.maxlength"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :show-password="item.showpassword"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      :suffix-icon="item.suffixicon"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @blur="formChange"
    >
      <template v-if='item.prepend' slot="prepend">{{item.prepend}}</template>
      <template v-if='item.append' slot="append">{{item.append}}</template>
    </el-input>
    <span class="el-form-item__error" v-if='errorShow'>{{item.regularMessage}}</span>
    <el-input
      v-model="forms[item.prop]"
      v-if='item.type==="InputReadOnly" || item.type==="inputReadOnly"'
      :disabled="item.disabled || true"
      :placeholder="item.placeholder || item.label"
      :size="$store.state.params.form.size || item.size || 'mini'"
    ></el-input>
    <el-input
      type="textarea"
      v-if='item.type==="textarea"'
      v-model="forms[item.prop]"
      :rows="item.rows"
      :show-word-limit="item.showwordlimit"
      :minlength="item.minlength"
      :maxlength="item.maxlength"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :size="$store.state.params.form.size || item.size || 'mini'"
      :autosize="item.autoSize || false"
      @blur="formChange"
    ></el-input>
    <el-input
      type="textarea"
      v-if='item.type==="textareaReadOnly"'
      v-model="forms[item.prop]"
      rows="2"
      :placeholder="item.placeholder || item.label"
      :disabled="item.disabled || true"
      :size="$store.state.params.form.size || item.size || 'mini'"
    ></el-input>
    <el-input-number
      v-if='item.type==="inputNumber"'
      v-model="forms[item.prop]"
      :min="item.min"
      :max="item.max"
      :step="item.step"
      :step-strictly="item.stepstrictly"
      :precision="item.precision"
      :disabled="item.disabled"
      :controls-position="item.controlsposition"
      :placeholder="item.placeholder || item.label"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-input-number>

    <el-select
      v-if='item.type==="select"'
      v-model="forms[item.prop]"
      :placeholder="item.placeholder || item.label"
      :multiple="item.multiple"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :clearable="item.clearable"
      :filterable="item.filterable"
      :allow-create="item.allowcreate"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    >
      <el-option
        v-for="(sitem) in selectOption"
        :key="sitem[(item.props && item.props.value) || 'value']+item.prop +Math.random() + Date.now().toString()"
        :label="sitem[(item.props && item.props.label) || 'label']"
        :value="sitem[(item.props && item.props.value) || 'value']"
      >
        <span style="float: left">{{ sitem[(item.props && item.props.label) || 'label'] }}</span>
        <span v-if="sitem.tip" style="float: right; color: #8492a6; font-size: 13px">{{ sitem.tip }}</span>
      </el-option>
    </el-select>

    <el-switch
      v-if='item.type==="switch"'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :active-text="item.activetext"
      :inactive-text="item.inactivetext"
      :active-color="item.activecolor"
      :inactive-color="item.inactivecolor"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-switch>

    <el-slider
      v-if='item.type==="slider"'
      v-model="forms[item.prop]"
      :min="item.min"
      :max="item.max"
      :disabled="item.disabled"
      :step="item.step"
      :show-stops="item.showstops"
      :show-input="item.showinput"
      :range="item.range"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-slider>

    <el-time-select
      v-if='item.type==="timeSelect"'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :clearable="item.clearable"
      :picker-options="item.pickeroptions"
      :placeholder="item.placeholder || item.label"
      :prefix-icon="item.prefixicon"
      value-format="HH:mm:ss"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-time-select>

    <el-time-picker
      v-if='item.type==="timePicker"'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :clearable="item.clearable"
      :placeholder="item.placeholder || item.label"
      :prefix-icon="item.prefixicon"
      :is-range="item.isrange"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      value-format="HH:mm:ss"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-time-picker>

    <el-date-picker
      v-if='(item.type==="datePicker") && ( item.datetype=="date" || item.datetype=="dates" || item.datetype=="daterange")'
      v-model="forms[item.prop]"
      :type="item.datetype"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy-MM-dd"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker") && item.datetype=="week"'
      v-model="forms[item.prop]"
      type="week"
      format="yyyy 第 WW 周"
      value-format="yyyy-MM-dd"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker")&& ( item.datetype=="month"|| item.datetype=="monthrange" )'
      v-model="forms[item.prop]"
      :type="item.datetype"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy-MM"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker") && item.datetype=="year"'
      v-model="forms[item.prop]"
      type="year"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker") && (item.datetype=="datetime" || item.datetype=="datetimerange")'
      v-model="forms[item.prop]"
      :type="item.datetype"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy-MM-dd HH:mm:ss"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>

    <el-radio-group
      v-if='(item.type==="radio")'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    >
      <div v-if='item.radiotype==="yuan" || !item.radiotype'>
        <el-radio
          v-for="(item2) in selectOption"
          :key="item2[(item.props && item.props.value) || 'value']+item2[(item.props && item.props.label) || 'label']+'yuan'"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-radio>
      </div>
      <div v-if='item.radiotype==="button"'>
        <el-radio-button
          v-for="(item2) in selectOption"
          :key="item2[(item.props && item.props.value) || 'value'] + item2[(item.props && item.props.label) || 'label'] +'but'"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-radio-button>
      </div>
    </el-radio-group>

    <el-checkbox-group
      v-if='(item.type==="checkbox") && forms[item.prop]'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :border="item.border"
      :min="item.min"
      :max="item.max"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    >
      <div v-if='(item.checkboxtype=== "fang" || !item.checkboxtype) && selectOption && selectOption.length > 0'>
        <el-checkbox
          v-for="(item2) in selectOption"
          :key="item2[(item.props && item.props.value) || 'value']+item.label"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-checkbox>
      </div>
      <div v-if='item.checkboxtype=== "button" && selectOption && selectOption.length > 0'>
        <el-checkbox-button
          v-for="(item2) in selectOption"
          :key="'checkbut'+item2[(item.props && item.props.value) || 'value']+item.label"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-checkbox-button>
      </div>
    </el-checkbox-group>

    <!-- 颜色选择器 -->
    <el-color-picker v-if="(item.type == 'colorSelect')" v-model="forms[item.prop]" :placeholder="item.placeholder || item.label" @change="formChange"></el-color-picker>

    <!-- 图片 -->
    <ul
      class="el-upload-list el-upload-list--picture-card"
      v-if='item.type==="image"'
    >
      <li
        tabindex="0"
        class="el-upload-list__item is-success"
        v-for="mi in forms[item.prop]"
        :key="'image'+mi.url"
        @click="handlePictureCardPreview(mi.url)"
      >
        <el-image style="width: 100%; height: 100%;" :src="mi.url" :fit="item.fit || 'contain'">
          <div slot="error" class="image-slot loading-back" style="position:absolute;">
            <i class="el-icon-loading" style="font-size: 24px;color:#999;"></i>
          </div>
        </el-image>
      </li>
      <li
        tabindex="0"
        class="el-upload-list__item"
        v-if='!forms[item.prop] || forms[item.prop].length==0'
      >
        <el-image style="width: 100%; height: 100%;" src :fit="item.fit || 'contain'">
          <div slot="error" class="image-slot loading-back" style="position:absolute;">
            <i class="el-icon-loading" style="font-size: 24px;color:#999;"></i>
          </div>
        </el-image>
      </li>
    </ul>

    <!-- 上传图片 -->
    <el-upload
      v-if='(item.type === "imageUpload")'
      :class="item.fileList.length < (item.limit ? item.limit : 5) ? 'form-list-upload-img' : 'form-list-upload-img-none'"
      :ref="'uploadImageBtn'+'_'+item.prop"
      :action="item.action || (item.uploadHttp && item.uploadHttp.url) || ''"
      :multiple="item.multipleUpload"
      :limit="item.limit || 5"
      :headers="item.headers || {}"
      :file-list="item.fileList || []"
      :size="$store.state.params.form.size || item.size || 'mini'"
      list-type="picture-card"
      :data="formatUploadData(item)"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
      :auto-upload="true"
      :on-success="handleSuccess"
      :on-error="item.handleError"
      :on-preview="handlePictureCardPreviewUpload"
      :on-remove="handleRemove"
      :on-change="uploadChangeHandle"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"></i>
      <div v-if="imageValidate" slot="tip" class="el-upload__tip" style="color: #F56C6C;font-size: 12px;">只能上传图片，且不超过20M</div>
    </el-upload>

    <!-- 预览图片 -->
    <el-dialog
      v-if='item.type === "imageUpload" || item.type === "image"'
      class="preViewDialog"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- 上传文件 -->
    <el-upload
      v-if='item.type === "fileUpload"'
      :class="item.fileList.length < (item.limit ? item.limit : 5) ? 'form-list-upload-file' : 'form-list-upload-file-none'"
      :ref="'uploadFileBtn'+'_'+item.prop"
      :action="item.action || (item.uploadHttp && item.uploadHttp.url) || ''"
      :multiple="item.multipleUpload"
      :limit="item.limit"
      :headers="item.headers"
      :file-list="item.fileList"
      :size="$store.state.params.form.size || item.size || 'mini'"
      :data="formatUploadData(item)"
      :auto-upload="true"
      :on-success="handleSuccess"
      :on-error="item.handleError"
      :on-remove="handleRemove"
      :on-change="uploadChangeHandle"
      :before-upload="beforeUpload"
    >
      <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
      <div v-if="fileValidate" slot="tip" class="el-upload__tip" style="color: #F56C6C;font-size: 12px;">文件大小不超过20M</div>
    </el-upload>

    <!-- 文件列表 -->
    <ul class="el-upload-list el-upload-list--text" v-if="item.type==='file'">
      <li
        class="el-upload-list__item is-success"
        v-for="fi in forms[item.prop]"
        :key="'file'+fi.url"
      >
        <a
          class="el-upload-list__item-name"
          target="_blank"
          :href="fi.url?fi.url:'javascript:void(0)'"
        >
          <i class="el-icon-document"></i>
          {{fi.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close"></i>
      </li>
      <li class="el-upload-list__item" v-if='!forms[item.prop] || forms[item.prop].length==0'>
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{'文件名称'}}
        </a>
      </li>
    </ul>

    <!-- 选项卡 -->
    <jvs-tab
      style="width: 100%;"
      :originOption="originOption"
      :defalutSet="defalutSet"
      :formRef="formRef"
      v-if="item.type=='tab'"
      :active="item.activeName"
      :formItem="item"
      :forms="forms[item.prop]"
      :option="{type:'card', column: item.dicData}"
      :userList="userList"
      :resetRadom="resetRadom"
      @tab-click="tabClick"
      @formChange="tabFormchange">
    </jvs-tab>
    <!-- <el-tabs v-model="item.activeName" type="card" @tab-click="item.handleClick(item.activeName)" v-if="item.type==='tab'">
      <el-tab-pane v-for="ti in item.dicData" :key="'tab'+ti.value" :label="ti.label" :name="ti.value"></el-tab-pane>
    </el-tabs> -->

    <!-- 展示的表格 -->
    <!-- <el-table
      v-if="item.type==='TableReadOnly' || item.type==='tableReadOnly'"
      :data="forms[item.prop]"
      :border="item.border"
      highlight-current-row
      class="tb-edit"
      align="center"
      style="width: 100%;cursor:pointer;"
    >
      <el-table-column
        v-for="(ti) in item.option"
        :key="''+ti.value+'table'"
        :prop="ti.value"
        :label="ti.label"
        style="text-align:center;"
      ></el-table-column>
    </el-table> -->

    <!-- 描述框 -->
    <div
      v-if="item.type==='box'"
      :style="'height: 32px;line-height:28px;text-align:'+item.contentposition+';font-size:'+item.fontsize+'px;color:'+item.textcolor+';font-weight:'+item.fontweight+';'"
    >
      {{forms[item.prop]}}
      <span v-if='!forms[item.prop]'>{{item.text}}</span>
    </div>
    <!-- 链接 -->
    <a
      v-if="item.type =='link'"
      :href="forms[item.prop]?forms[item.prop]:'javascript:void(0);'"
      :target="item.openType"
      :style="'height: 32px;line-height:28px;text-align:'+item.contentposition+';font-size:'+item.fontsize+'px;color:'+item.textcolor+';font-weight:'+item.fontweight+';text-decoration:'+item.textdecoration+';'"
    >{{item.text}}</a>
    <!-- 嵌入页面 -->
    <div v-if="item.type==='iframe'" :style="'width:100%;height:'+item.iframeheight+';background:#ecf5ff;'">
      <iframe
        :name="item.id"
        :id="item.prop"
        :src="item.iframeurl"
        frameborder="0"
        width="100%"
        height="100%"
        scrolling="scroll"
      ></iframe>
    </div>

    <!-- 图标选择器 -->
     <div class="form-item-icon-selct" style="position: relative;" v-if="item.type == 'iconSelect'" :id="'icon-select-item-'+item.prop">
       <el-popover
          placement="bottom"
          :width="getWidth(item)"
          v-if="!item.disabled"
          trigger="click">
          <div class="icon-select-tool">
            <i v-for="(it, itx) in iconList" :key="itx+it" :class="it" @click="checkIcon(item.prop, it)"></i>
          </div>
          <div slot="reference" style="display:flex;align-items: center;">
            <el-input v-model="forms[item.prop]" placeholder="图标" :disabled="item.disabled"></el-input>
            <i v-if="forms[item.prop]" :class="forms[item.prop]" style="margin-left:10px;"></i>
          </div>
        </el-popover>
        <div v-else style="display:flex;align-items: center;">
          <el-input v-model="forms[item.prop]" placeholder="图标" :disabled="item.disabled"></el-input>
          <i v-if="forms[item.prop]" :class="forms[item.prop]" style="margin-left:10px;"></i>
        </div>
      </div>

    <!-- p文字 -->
    <p v-if="item.type === 'p'"  :style="{'text-align': item.contentposition,'font-size':item.fontsize+'px',color:item.textcolor}">{{item.text}}</p>

    <!-- 分割线 -->
    <el-divider v-if="item.type === 'divider'" :content-position='item.contentposition'>{{item.text}}</el-divider>

    <!-- 用户组件 -->
    <userForm
      v-if="item.type==='user'"
      :form="forms"
      :prop="item.prop"
      :selectable="item.multiple"
      :defaultValue="item.defaultValue"
      :enableinput="item.allowinput"
      :disabled="item.disabled"
      :resetRadom="resetRadom"
      @change="formChange" /> <!-- @formChange="tabFormchange" -->

    <!-- 计数器   滑块   显示单位 -->
    <span v-if="['inputNumber', 'slider'].indexOf(item.type) > -1 && item.unit" style="padding-left: 5px;">{{item.unit}}</span>

    <!-- 地区选择 -->
    <el-cascader
      v-if="item.type==='chinaArea'"
      v-model="forms[item.prop]"
      size="mini"
      :options="chinaAreaList"
      clearable
      :show-all-levels="item.showalllevels"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :props="{
        expandTrigger: 'hover',
        multiple: item.multiple === false ? item.multiple : true,
        label: 'name',
        value: item.emitKey ? item.emitKey : 'code',
        emitPath: item.emitPath
      }"
      @change="formChange"
    >
    </el-cascader>

    <!-- 富文本 -->
    <div v-if="item.type === 'htmlEditor'" :id="item.prop+'-editor'"></div>

    <!-- 按钮 -->
    <jvs-button v-if="item.type === 'button'" :disabled="item.disabled" :type="item.buttonType" :round="item.buttonRound" :size="item.size" @click="btnClick">{{item.text}}</jvs-button>

    <!-- 级联选择 -->
    <el-cascader
      v-if="item.type==='cascader'"
      v-model="forms[item.prop]"
      size="mini"
      :options="cascaderList"
      clearable
      :show-all-levels="item.showalllevels"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :props="{
        expandTrigger: 'hover',
        multiple: item.multiple === false ? item.multiple : true,
        label: 'name',
        value: item.emitKey ? item.emitKey : 'value',
        emitPath: item.emitPath
      }"
      @change="formChange"
    >
    </el-cascader>

    <!-- 表单卡片 -->
    <formCard
      v-if="item.type == 'formbox'"
      :formItem="item"
      :forms="forms[item.prop]"
      :originOption="originOption"
      :defalutSet="defalutSet"
      :userList="userList"
      :resetRadom="resetRadom"
      @formChange="tabFormchange"
      >
    </formCard>

    <!-- 右侧提示 -->
    <el-tooltip v-if="item.tips && item.tips.position == 'right' && item.tips.text" class="form-item-tooltip" effect="dark" :content="item.tips.text" placement="top">
      <i class="el-icon-question"></i>
    </el-tooltip>
  </div>
</template>

<script>
import userForm from './userForm'
import iconList from '@/const/iconfont'
import systemIcon from '@/const/systemIcon'
import formCard from './formcard'
// import {getSelectData, getFetchTable, getLineDataOfGet, getFormReviewData} from '../api/tableDesignsenior'
import {getSelectData} from '@/api/index'
import {areaList} from '@/const/chinaArea.js'
import E from 'wangeditor'
import {sendMyRequire} from '@/api/newDesign'
export default {
  name: "formitem",
  components: {
    userForm,
    formCard,
  },
  props: {
    // 表单对象
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单内的组件对象
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    originOption: {
      type: Object
    },
    defalutSet: {
      type: Object
    },
    formRef: {
      type: String,
      default: 'ruleForm'
    },
    // 用户列表
    userList : {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否需要刷新组件
    freshBoolean: {
      type: Boolean
    },
    // 是否需要重新初始化
    reinitFlag: {
      type: Number
    },
    // 表格行数据
    rowData: {
      type: Object
    },
    resetRadom: {
      type: Number
    }
  },
  computed: {
    forms () {
      return this.form
    },
  },
  data () {
    return {
      selectOption: [],
      startEndLimitHandle: {
        disabledDate: time => {
          let bool=false
          if (!this.item.startLimit) {
            let end=new Date(this.item.endLimit).getTime()
            if (time.getTime()<=end) {
              bool=false
            } else {
              bool=true
            }
          }
          if (!this.item.endLimit) {
            let start=new Date(this.item.startLimit).getTime()
            if (time.getTime()>=start-8.64e7) {
              bool=false
            } else {
              bool=true
            }
          }
          if (!this.item.startLimit&&!this.item.endLimit) {
            bool=false
          }
          if (this.item.startLimit&&this.item.endLimit) {
            let start=new Date(this.item.startLimit).getTime()
            let end=new Date(this.item.endLimit).getTime()
            if (time.getTime()>=start-8.64e7&&time.getTime()<=end) {
              bool=false
            } else {
              bool=true
            }
          }
          return bool
        }
      },
      errorShow: false, // 自定义验证提示错误
      dialogVisible: false, // 预览图片弹框
      dialogImageUrl: '', // 预览图片地址
      iconList: [...iconList, ...systemIcon], // 图标列表
      chinaAreaList: areaList,
      cascaderList: [], // 级联选择数据
      editor: null, // 富文本
      pathArr: [], // 路径结果
      imageValidate: false,
      fileValidate: false,
      eventList: ['button', 'input', 'textarea', 'inputNumber', 'select', 'slider', 'switch', 'datePicker', 'timeSelect', 'timePicker',
      'radio', 'checkbox', 'imageUpload', 'fileUpload', 'htmlEditor', 'cascader', 'chinaArea', 'user'],
      initHtml: '', // 记录富文本初始值
    };
  },
  methods: {
    changeHandle (val) {
      this.$set(this.item, 'currVal', val)
      this.$set(this.forms, this.item.prop, val)
      this.formChange()
      this.$forceUpdate()
    },
    uploadChangeHandle (file, fileList) {
      // console.log('upload change.....')
      // console.log(fileList)
      this.$forceUpdate()
      let obj={}
      obj[this.item.prop]=fileList
      this.$emit('currentValueHandle', obj)
    },
    beforeUpload (file) {
      if(file.size > 20971520) {
        if(this.item.type == 'imageUpload') {
          this.imageValidate = true
        }else{
          this.fileValidate = true
        }
        return false
      }else{
        if(this.item.type == 'imageUpload') {
          this.imageValidate = false
        }else{
          this.fileValidate = false
        }
      }
    },
    async initItem () {
      if (!this.item.dicUrl && !this.item.url) {
        if (this.item.dicData) {
          this.selectOption=this.item.dicData
        }
      } else {
        let url=this.item.dicUrl || this.item.url
        if (!url) {
          return false
        }
        getSelectData(url).then(res => {
          if(res.data.code === 0) {
            this.selectOption = []
            for(let sitem in res.data.data){
              if(typeof res.data.data[sitem] == 'string') {
                this.selectOption.push({
                  label: res.data.data[sitem],
                  value: res.data.data[sitem]
                })
              }else{
                // this.selectOption.push({
                //   label: res.data.data[sitem][this.item.props.label ? this.item.props.label : 'label'],
                //   value: res.data.data[sitem][this.item.props.value ? this.item.props.value : 'value']
                // })
                this.selectOption.push(res.data.data[sitem])
              }
            }
          }
        })
      }
      if(['checkbox', 'formbox'].indexOf(this.item.type) > -1) {
        !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, []))
      }
      // 下拉切换是否多选时，初始化数据类型
      if(this.item.type == 'select') {
        if(this.item.multiple) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, []))
        }else{
          if((!this.forms[this.item.prop] && this.forms[this.item.prop] !== 0 && this.forms[this.item.prop] !== false) || this.forms[this.item.prop] instanceof Array) {
            this.$set(this.forms, this.item.prop, "")
          }
        }
      }
      // 滑块
      if(this.item.type == 'slider') {
        if(this.item.range) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, [0, this.item.max / 2]))
        }else{
          if(!this.forms[this.item.prop] || this.forms[this.item.prop] instanceof Array) {
            this.$set(this.forms, this.item.prop, 0)
          }
        }
      }
      // 表单项默认值填充，权重小于表单初始化值
      if(this.item.defaultValue || this.item.defaultValue === false || this.item.defaultValue === "") {
        (!this.forms[this.item.prop] && this.forms[this.item.prop] !== false && this.forms[this.item.prop] !== 0) && (this.$set(this.forms, this.item.prop, this.item.defaultValue))
      }
      // tab选项卡  step步骤条
      if(['tab'].indexOf(this.item.type) > -1) {
        if(this.item.dicData && this.item.dicData.length > 0) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, {}))
          for(let col in this.item.column) {
            if(this.item.column[col] && this.item.column[col].length > 0) {
              !this.forms[this.item.prop][col] && (this.$set(this.forms[this.item.prop], col, {}))
            }
          }
        }
      }
      if(['imageUpload', 'fileUpload'].indexOf(this.item.type) > -1 && this.forms[this.item.prop]){
        this.$set(this.item, 'fileList', this.forms[this.item.prop])
      }
      this.$forceUpdate()
    },
    handlePictureCardPreview (url) {
      this.dialogImageUrl=url
      this.dialogVisible=true
    },
    handlePictureCardPreviewUpload (file) {
      this.dialogImageUrl=file.url
      this.dialogVisible=true
    },
    checkIcon (key, icon) {
      this.form[key] = icon
      this.$forceUpdate()
    },
    // 字段值改变传出表单
    formChange () {
      this.$emit('formChange', this.form)
      if(this.eventList.indexOf(this.item.type) > -1) {
        this.eventRequireHandle()
      }
      if(this.item.type == 'user') {
        if(this.item.rules && this.item.rules.length > 0) {
          if(this.item.rules[0].required) {
            if(this.item.multiple) {
              if(this.form[this.item.prop].length > 0) {
                this.$emit('validateHandle', {type: 'clear', item: this.item})
              }else{
                this.$emit('validateHandle', {type: 'validate', item: this.item})
              }
            }else{
              if(this.form[this.item.prop]) {
                this.$emit('validateHandle', {type: 'clear', item: this.item})
              }else{
                this.$emit('validateHandle', {type: 'validate', item: this.item})
              }
            }
          }
        }
      }
    },
    // 选项卡formchange
    tabFormchange (data) {
      this.$set(this.form, this.item.prop, data)
      this.formChange()
      this.$forceUpdate()
    },
    addRowHandle () {
      if(!this.forms[this.item.prop]) {
        this.$set(this.forms, this.item.prop, [])
      }
      this.forms[this.item.prop].push({})
    },
    deleteRow (row, index) {
      this.forms[this.item.prop].splice(index, 1)
    },
    // 同步表格数据
    setTableHandle (data) {
      this.$set(this.forms, this.item.prop, data)
    },
    // 获取宽度占比
    getWidth (item) {
      let w = 400
      if(item.prop && document.getElementById('icon-select-item-'+item.prop)) {
        w = document.getElementById('icon-select-item-'+item.prop).clientWidth
      }
      return w
    },
    // 初始化富文本
    initEditor (prop) {
      let that = this
      this.$nextTick(() => {
        let _this = that
        if(_this.editor) {
          _this.editor.destroy()
        }
        _this.editor = null
        $('#' + prop + '-editor').html("")
        _this.editor = new E('#' + prop + '-editor')
        _this.editor.config.height = 400
        // _this.editor.config.uploadImgShowBase64 = true
        _this.editor.config.menus = [
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'strikeThrough',
          'indent',
          'lineHeight',
          'foreColor',
          'backColor',
          'link',
          'list',
          'justify',
          'quote',
          'emoticon',
          'image',
          'table',
          'code',
          'splitLine',
          'undo',
          'redo',
        ]
        _this.editor.config.onblur = function (newHtml) {
          let vb = false
          if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
            _this.$set(_this.form, prop, "")
            vb = false
          }else{
            _this.$set(_this.form, prop, newHtml)
            vb = true
          }
          if(_this.item.rules && _this.item.rules.length > 0) {
            if(_this.item.rules[0].required) {
              if(vb) {
                _this.$emit('validateHandle', {type: 'clear', item: _this.item})
              }else{
                _this.$emit('validateHandle', {type: 'validate', item: _this.item})
              }
            }
          }
          _this.eventRequireHandle()
        }
        _this.editor.config.onchange = function (newHtml) {
          let vb = false
          if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
            _this.$set(_this.form, prop, "")
            vb = false
          }else{
            _this.$set(_this.form, prop, newHtml)
            vb = true
          }
          if(_this.item.rules && _this.item.rules.length > 0) {
            if(_this.item.rules[0].required) {
              if(vb) {
                _this.$emit('validateHandle', {type: 'clear', item: _this.item})
              }else{
                _this.$emit('validateHandle', {type: 'validate', item: _this.item})
              }
            }
          }
        }
        // _this.editor.config.uploadImgServer = '/api/file/upload/jvshtmleditor'
        _this.editor.config.uploadImgServer = '/mgr/document//upload/jvs-public'
        _this.editor.config.uploadFileName = 'file'
        _this.editor.config.uploadImgHooks = {
          // 图片上传并返回了结果，图片插入已成功
          success: function(xhr) {
            console.log('success', xhr)
          },
          // 图片上传并返回了结果，但图片插入时出错了
          fail: function(xhr, editor, resData) {
            console.log('fail', resData)
          },
          // 上传图片出错，一般为 http 请求的错误
          error: function(xhr, editor, resData) {
            console.log('error', xhr, resData)
          },
          // 图片上传并返回了结果，想要自己把图片插入到编辑器中
          // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
          customInsert: function(insertImgFn, result) {
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            if(result.code == 0 && result.data && result.data.fileLink) {
              // let url = result.data.filelink.indexOf('?') ? result.data.filelink.split('?')[0] : result.data.filelink
              insertImgFn(result.data.fileLink)
            }
          }
        }
        _this.editor.create()
        if(_this.form[prop]) {
          _this.form[prop] = _this.form[prop].replace(/&lt;/g, "<")
          _this.form[prop] = _this.form[prop].replace(/&gt;/g, ">")
          _this.editor.txt.html(_this.form[prop])
          _this.initHtml = _this.form[prop]
        }
        if(_this.item.disabled) {
          _this.editor.disable()
        }else{
          _this.editor.enable()
        }
      })
      this.$forceUpdate()
    },
    tabClick (name) {
      if(this.item.handleClick) {
        this.item.handleClick(name)
      }
    },
    // 按钮点击
    btnClick () {
      if(this.item.eventType == 'url') {
        if(this.item.openUrl) {
          this.$openUrl(this.item.openUrl, this.item.newWindowOpen ? '_blank' : '_self')
        }
      }else{
        this.eventRequireHandle()
      }
    },
    // 上传成功回调
    handleSuccess (res, file, fileList) {
      if(res.code === 0){
        let obj = {
          name: res.data.originalFileName,
          url: res.data.filelink,
          fileName: res.data.fileName
        }
        this.item.fileList.push(obj)
        let temp = {
          key: this.item.prop,
          fileList: this.item.fileList
        }
        this.$emit('file', temp)
        this.$set(this.forms, this.item.prop, this.item.fileList)
        this.eventRequireHandle()
      }
    },
    eventRequireHandle () {
      if(this.item.eventHttp) {
        let tp = JSON.parse(JSON.stringify(this.item.eventHttp))
        if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
          tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        }
        if(tp && tp.url) {
          sendMyRequire(tp, this.form).then(res => {
            if(res.data.code == 0) {
              if(res.data.msg) {
                this.$message.success(res.data.msg)
                if(res.data.data) {
                  for(let i in res.data.data) {
                    this.$set(this.form, i, res.data.data[i])
                  }
                  this.$emit('formChange', this.form)
                }
              }
            }
          }).catch(e => {})
        }
      }
    },
    // 处理上传参数
    formatUploadData (item) {
      let obj = {}
      if(item.uploadHttp) {
        obj = item.uploadHttp.parameters
      }
      return obj
    },
    // 删除
    handleRemove (file, fileList) {
      for(let i in this.item.fileList) {
        if(this.item.fileList[i].uid == file.uid) {
          this.item.fileList.splice(i, 1)
          let temp = {
            key: this.item.prop,
            fileList: this.item.fileList
          }
          this.$emit('file', temp)
          this.$set(this.forms, this.item.prop, this.item.fileList)
        }
      }
    }
  },
  watch: {
    item: {
      handler () {
        this.initItem()
        // 下拉框 单选 自定义选择
        if(this.item.currVal) {
          if(this.item.multiple) {
            if(this.item.currVal instanceof Array !== true) {
              this.$set(this.forms, this.item.prop, [])
            }else{
              this.$set(this.forms, this.item.prop, this.item.currVal)
            }
          }else{
            if(this.item.currVal instanceof Array !== true) {
              this.$set(this.forms, this.item.prop, this.item.currVal)
            }else{
              this.$set(this.forms, this.item.prop, "")
            }
          }
        }
        if(this.item.type == 'htmlEditor') {
          $('#' + this.item.prop + '-editor').html("")
          this.initEditor(this.item.prop)
        }
        if(['imageUpload', 'fileUpload'].indexOf(this.item.type) > -1) {
          if(this.item.rules && this.item.rules.length > 0) {
            if(this.item.rules[0].required) {
              if(this.forms[this.item.prop].length > 0) {
                this.$emit('validateHandle', {type: 'clear', item: this.item})
              }else{
                this.$emit('validateHandle', {type: 'validate', item: this.item})
              }
            }
          }
        }
      },
      deep: true
    },
    freshBoolean: {
      handler(newVal, oldVal) {
        if(this.item.type == 'htmlEditor') {
          $('#' + this.item.prop + '-editor').html("")
          this.initEditor(this.item.prop)
        }else{
          $('#' + this.item.prop + '-editor').html("")
          this.editor.destroy()
        }
      }
    },
    reinitFlag: {
      handler(newVal, oldVal) {
        if(newVal != -1) {
          this.initItem()
        }
      }
    },
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          if(this.item.type == 'htmlEditor') {
            this.editor.txt.html(this.initHtml)
          }
          if(this.item.type == 'checkbox') {
            if(!this.forms[this.item.prop]) {
              this.$set(this.forms, this.item.prop, [])
            }
          }
        }
      }
    }
  },
  created () {
    this.initItem()
  },
  mounted () {
    if(this.item.type == 'htmlEditor') {
      $('#' + this.item.prop + '-editor').html("")
      this.initEditor(this.item.prop)
    }
  }
};
</script>

<style lang="scss">
.loading-back {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-list-upload-img {
  .el-upload--picture-card {
    display: inline-block;
  }
}
.form-list-upload-img-none {
  .el-upload--picture-card {
    display: none;
  }
}
.form-list-upload-file {
  .el-upload--text {
    display: inline-block;
  }
}
.form-list-upload-file-none {
  .el-upload--text {
    display: none;
  }
}
.icon-select-tool{
  // margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  height: 200px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
  // box-shadow: 0 0 10px #ccc;
  i{
    margin: 10px;
    display: block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }
  i:hover{
    color: #409EFF;
  }
}
.icon-select-tool::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.icon-select-tool-position{
  position: absolute;
  height: 158px;
  top: 45px;
  margin: 0;
  z-index: 9;
}
.jvs-form-item{
  min-height: 32px;
  .el-slider, p, .el-input-number, .el-select, .el-date-editor, .form-item-icon-selct, .el-tabs, .el-cascader, .user-info-list{
    flex: 1;
  }
  .el-input-number{
    .el-input__inner{
      text-align: left;
    }
  }
  .el-input-number.is-disabled{
    flex: none;
    width: auto;
    .el-input{
      width: auto;
      .el-input__inner{
        padding-right: 0;
      }
    }
  }
}
</style>
