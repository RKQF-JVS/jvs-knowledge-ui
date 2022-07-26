<template>
  <div class="jvs-table">
    <PageHeader :title="pageheadertitle" :class="{'jvs-table-titleTop': true, 'jvs-table-top': !option.search == false}">
      <!-- <div style="height:20px" v-if="pageheadertitle"></div> -->
      <slot name="headerTop"></slot>
      <jvs-form v-if="!option.search == false && searchOption.column && searchOption.column.length > 0" :formData="searchFormData" :defalutFormData="searchFormData" class="search-form" :option="searchOption" @submit="searchHandle" :isSearch="true">
      </jvs-form>
      <div class="table-top">
        <div class="table-top-left">
          <el-button type="primary" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.addBtn==false)" @click="addForm">{{option.addBtnText || '新增'}}</el-button>
          <slot name="menuLeft"></slot>
        </div>
        <div class="table-top-right">
          <slot name="menuRight"></slot>
        </div>
      </div>
    </PageHeader>
    <h4 class="table-title">{{option.title}}</h4>
    <div class="table-body-box">
      <el-table
        header-row-class-name='headerclass'
        :stripe="true"
        :ref="refs"
        :data="data"
        :tooltip-effect="tooltipEffect"
        :show-header="showHeader"
        :border="option.border"
        v-loading="loading"
        :size="size || 'mini'"
        :highlight-current-row="option.highlightCurrentRow"
        empty-text="抱歉，没有找到相关搜索内容！"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        style="margin-top:10px"
      >
        <el-table-column type="selection" width="55" v-if="selectable"></el-table-column>
        <el-table-column type="index" width="50" :label="option.indexLabel" v-if="index"> </el-table-column>
        <el-table-column
          v-for="item in option.column"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :show-overflow-tooltip="item.type == 'image' ? false : tooltipShow(item, option)"
          :header-align="option.menuAlign"
          :align="item.align || option.align"
          :width="item.width"
          v-if="!item.hide"
          :type="item.expand"
        >
          <template slot-scope="scope" >
            <span>
              <!-- 自定义 -->
              <slot v-if="item.slot && !item.expand" :name="item.prop" :row="scope.row" :index="scope.$index"></slot>
              <!-- 动态控制 -->
              <span v-if="!item.slot && !item.expand && item.expressControl && item.expressControl.length > 0" :style="'color:'+ styleRowItem(scope.row, item, 'color')+';'">{{styleRowItem(scope.row, item, 'text')}}</span>
              <span v-if="!item.slot && !item.expand && (!item.expressControl || item.expressControl.length == 0)">
                <!-- 一般列 -->
                <span v-if="!item.color && !item.dicData && (['datetime', 'link', 'image'].indexOf(item.type) == -1)" :style="'color:'+item.color+';'">{{scope.row[item.prop]}}</span>
                <!-- 特殊颜色 -->
                <span v-if="item.color && !item.dicData && (['datetime', 'link', 'image'].indexOf(item.type) == -1)" :style="'color:'+item.color+';'">{{scope.row[item.prop]}}</span>
                <!-- 日期时间 -->
                <span v-if="item.type == 'datetime'" :style="item.color ? ('color:'+item.color): ''">{{scope.row[item.prop] | dateFormat(item.format)}}</span>
                <!-- 字典 -->
                <span v-if="(['datetime', 'link', 'image'].indexOf(item.type) == -1) && item.dicData" :style="item.color ? ('color:'+item.color): ''">{{scope.row[item.prop] | dicFormat(item.dicData, item.props)}}</span>
                <!-- 链接 -->
                <a :href="scope.row[item.prop]" :target="item.openType || '_blank'" v-if="item.type == 'link'" :style="item.color ? ('color:'+item.color): ''">{{item.text}}</a>
                <!-- 图片 -->
                <img v-if="item.type == 'image'" :src="scope.row[item.prop]" :style="item.width ? ('width:' + item.width + 'px;') : '' + item.height ? ('height:' + item.height + 'px;') : ''" />
              </span>
            </span>
          </template>

        </el-table-column>
        <el-table-column :fixed="option.menuFix" label="操作" :width="option.menuWidth" v-if="option.menu!==false" :align="option.menuAlign">
          <template slot-scope="scope">
            <div>
              <el-button type="text" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.viewBtn==false)" @click="viewHandle(scope.row)">{{option.viewBtnText || '查看'}}</el-button>
              <el-button type="text" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.editBtn==false)" @click="editHandle(scope.row)">{{option.editBtnText || '编辑'}}</el-button>
              <!-- 操作栏自定义 -->
              <slot name="menu" :row="scope.row" :index="scope.$index"></slot>
              <el-button type="text" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.delBtn==false)" @click="delHandle(scope.row)">{{option.delBtnText || '删除'}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="tablepagination"
      v-if="option.page"
    >
      <el-pagination
        background
        :layout="page.layout || pagination.layout"
        :total="page.total || pagination.total"
        :current-page="page.currentPage || pagination.currentPage"
        :page-sizes="page.pageSizes || pagination.pageSizes"
        :page-size="page.pageSize || pagination.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <slot name="menuLeftBottom"></slot>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal='option.dialogClickModal'
      :close-on-press-escape='option.dialogEscape'
      append-to-body
      :width="option.dialogWidth || '75%'"
      :fullscreen="option.dialogWidth == '100%' ? true : false"
      :class="{'form-fullscreen-dialog': option.dialogWidth == '100%'}"
      :before-close="handleClose">
      <jvs-form v-if="dialogVisible" :formData="rowData" :defalutFormData="rowData" :option="formOpton" @submit="submitHandle" :isSearch="false" @cancalClick="handleClose">
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import PageHeader from '../../components/page-header/PageHeader'
import { byKeyDicData } from '@/api/common.js'
export default {
  name: "jvs-table",
  components: { PageHeader },
  props: {
    pageheadertitle: {
      type:String,
      default: '',
    },
    // 绑定表格 refs
    refs: {
      type: String,
      default: 'multipleTable'
    },
    // 是否显示表格头
    showHeader: {
      type: Boolean,
      default: true
    },
    // tip提示背景
    tooltipEffect: {
      type: String,
      default: 'light', // 'dark'
    },
    // 是否可以多选
    selectable: {
      type: Boolean,
      default: false
    },
    // 是否提示 等待加载loading
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    // 是否显示顺序
    index: {
      type: Boolean,
      default: false
    },
    // 分页配置
    page: {
      type: Object,
      default: (data) => {
        return {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
          pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
          layout: "total, sizes, prev, pager, next, jumper", // 分页工具
        }
      }
    },
    // 表格数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 搜索表单
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表格配置
    option: {
      type: Object,
      default: () => {
        return {
          border: false, // 表格是否边框
          page: true, // 是否分页
          align: 'center', // body对齐
          menuAlign: 'center', // 表头对齐
          menuFix: 'right', // 操作栏固定位置
          menuWidth: 200, // 操作栏宽度
          search: false, // 是否开启查询
          showOverflow: true, // 超出是否合并移入悬浮tip显示
          menu: true,
          indexLabel:'序号',
          // 搜索表单设置
          formAlign: 'right', //对其方式
          inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
          labelWidth: 'auto', // label宽
          searchBtn:true,//搜索的查询按钮
          searchBtnText: "查询", // 提交按钮文字，默认 提交
          submitBtn: true, // 提交按钮是否显示，默认显示
          submitBtnText: '保存', // 提交按钮文字，默认 提交
          emptyBtn: true, // 重置按钮，默认显示
          emptyBtnText: '清空', // 重置按钮文字，默认 重置
          addDialogText:'新增',//新增弹窗title,默认 新增
          editDialogText: '编辑', //编辑弹框title，默认 编辑
          submitLoading: false, // 默认表单提交按钮loading，初始值默认false
          searchLoading: false, // 查询表单提交按钮loading，初始值默认false
          column: [
            {
              label: '', // 文字
              prop: '', // 字段
              search: false, // 是否搜索
              slot: false, // 是否自定义
              hide: true, // 当前列在表格是否隐藏
              color: '', // 颜色特殊显示
              align: '', // 默认与table保持一致，可自定义 left right center
              menuAlign: '', // 默认与table保持一致，可自定义 left right center
              type: '', // 文本类型，默认input
              dicData: [], // 字典数据
              showOverflow: true, // 超出是否合并移入悬浮tip显示

              // 搜索表单对应
              span: 24, // 表单项栅格比，默认24
              formSlot: false, // 表单项是否自定义

              // 新增、编辑、查看对应表单设置
              addDisabled: false, // 表单新增时是否禁止
              addDisplay: true, // 表单新增时是否可见
              editDisabled: false, // 表单编辑时是否禁止
              editDisplay: false, // 表单编辑是否可见
              viewDisplay: true, // 表单查看是否可见
            }
          ]
        }
      }
    },
    // 是否清空多选，随机数
    isClearSelect: {
      type: Number
    },
    // 已选数据
    selectedRows: {
      type: Array
    },
    // 是否默认全选
    defaultAllSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchForm: {},
      title: '', // 弹框标题
      dialogVisible: false,
      rowData: {}, // 行数据
      formOpton: {},
      optype: 'addRow', // 提交方式
      pagination: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
        layout: "total, sizes, prev, pager, next, jumper", // 分页工具
      },
      // 搜索表单配置
      searchOption: {},
    };
  },
  filters: {},
  created () {
    let searchObj = {}
    this.searchOption = JSON.parse(JSON.stringify(this.option))
    this.searchOption.labelWidth = 'auto'
    let temp = []
    for(let i in this.searchOption.column) {
      if(this.option.column[i].dicUrl) {
        let _this = this
        byKeyDicData(this.option.column[i].dicUrl).then(res=>{
          _this.option.column[i].dicData = res.data.data
        })
      }
      if(this.searchOption.column[i] && this.searchOption.column[i].search == true) {
        if(this.searchOption.column[i].formSlot == true) {
          this.searchOption.column[i].formSlot = false
        }
        searchObj[this.searchOption.column[i].prop] = null
        // 弹窗表格的栅格
        if(this.searchOption.column[i] && !this.searchOption.column[i].span) {
          this.searchOption.column[i].span = this.searchOption.span || 6
        }
        // 搜索表格的栅格
        if (this.searchOption.column[i] && !this.searchOption.column[i].searchSpan && this.searchOption.column[i].search) {
          this.searchOption.column[i].searchSpan = this.searchOption.searchSpan || 6
        }
        // 去除提示tips
        if(this.searchOption.column[i] && this.searchOption.column[i].tips) {
          this.searchOption.column[i].tips = null
        }
        temp.push(this.searchOption.column[i])
      }
    }
    // 去除搜索条件的校验
    for(let j in temp) {
      if(temp[j].rules && temp[j].rules.length > 0) {
        for(let k in temp[j].rules) {
          if(temp[j].rules[k].required && temp[j].rules[k].required === true) {
            temp[j].rules[k].required = false
          }
        }
      }
    }
    this.searchOption.column = temp
    this.searchOption.isSearch = true
    if(JSON.stringify(this.searchFormData) == '{}') {
      this.searchFormData = JSON.parse(JSON.stringify(searchObj))
    }
    this.$emit('on-load', this.page)
  },
  mounted () {
    // 多选回显
    if(this.selectable == true) {
      if (this.selectedRows && this.selectedRows.length > 0 && this.$refs[this.refs]) {
        this.selectedRows.forEach(row => {
          for(let i in this.data) {
            let keys = Object.keys(this.data[i])
            let k2 = 'id' // Object.keys(row)[0]
            if(keys.indexOf(k2) > -1) {
            }else{
              k2 = 'aliasColumnName'
            }
            if(this.data[i][k2] == row[k2]) {
              this.$refs[this.refs].toggleRowSelection(this.data[i])
            }
          }
        });
      } else {
        this.$refs[this.refs].clearSelection();
        // 默认全选上
        if(this.defaultAllSelect == true) {
          this.data.forEach(row => {
            this.$refs[this.refs].toggleRowSelection(row);
          })
        }
      }
    }
    // 表格自适应高
    this.styleHeight()
  },
  computed: {
    searchFormData: {
      get () {
        return this.formData
      },
      set () {}
    }
  },
  methods: {
    // 行点击
    rowClick (row, column, cell, event) {
      this.$emit('row-click', { row, column, cell, event })
    },
    // 多选
    handleSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    // 搜索
    searchHandle (form) {
      this.$emit('search-change', form)
    },
    // 清空
    emptyHandle () {
      this.searchForm = {}
    },
    // 分页大小变化
    handleSizeChange (val) {
      this.page.pageSize = val
      this.$emit('on-load', this.page)
      this.$emit('size-change', this.page)
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.$emit('on-load', this.page)
      this.$emit('current-change', this.page)
    },
    // 判断是否需要超出文字提示
    tooltipShow (item, option) {
      let temp = true
      temp = (item.showOverflow == false) ? (item.showOverflow && option.showOverflow) : (item.showOverflow || option.showOverflow)
      return temp
    },
    // 关闭弹框
    handleClose () {
      this.rowData = {}
      this.dialogVisible = false
    },
    // 表单提交
    submitHandle (form) {
      if (this.optype == 'addRow') {
        this.$emit('addRow', form)
      }
      if (this.optype == 'editRow') {
        this.$emit('editRow', form)
      }
      this.handleClose()
    },
    // 新增
    addForm () {
      this.formOpton = this.option // JSON.parse(JSON.stringify(this.option))
      this.formOpton.submitBtnText = this.formOpton.submitBtnText || '提交'
      this.title = this.formOpton.addDialogText || '新增'
      this.optype = 'addRow'
      this.formOpton.disabled = false
      this.formOpton.submitBtn = true
      // this.formOpton.emptyBtn = true
      let temp = []
      for(let i in this.formOpton.column) {
        if(this.formOpton.column[i].addDisabled == true) {
          this.formOpton.column[i].disabled = true
        }
        if(this.formOpton.column[i].addDisplay != false) {
          temp.push(this.formOpton.column[i])
          this.formOpton.column[i].display = true
        }else{
          this.formOpton.column[i].display = false
        }
      }
      // this.formOpton.column = temp
      this.dialogVisible = true
    },
    // 查看
    viewHandle (row) {
      this.formOpton = JSON.parse(JSON.stringify(this.option))
      this.formOpton.submitBtnText = '提交'
      this.title = '查看'
      this.optype = 'viewRow'
      this.formOpton.disabled = true
      this.formOpton.submitBtn = false
      this.formOpton.emptyBtn = false
      this.rowData = row
      let temp = []
      for(let i in this.formOpton.column) {
        if(this.formOpton.column[i].viewDisplay != false) {
          temp.push(this.formOpton.column[i])
          this.formOpton.column[i].display = true
        }else{
          this.formOpton.column[i].display = false
        }
      }
      // this.formOpton.column = temp
      this.dialogVisible = true
    },
    editHandle (row) {
      this.formOpton = this.option // JSON.parse(JSON.stringify(this.option))
      this.formOpton.submitBtnText = this.formOpton.submitBtnText || '提交'
      this.title = this.formOpton.editDialogText || '编辑'
      this.optype = 'editRow'
      this.formOpton.disabled = false
      this.formOpton.submitBtn = true
      // this.formOpton.emptyBtn = true
      this.rowData = JSON.parse(JSON.stringify(row))
      let temp = []
      for(let i in this.formOpton.column) {
        if(this.formOpton.column[i].editDisabled == true) {
          this.formOpton.column[i].disabled = true
        }
        if(this.formOpton.column[i].editDisplay != false) {
          temp.push(this.formOpton.column[i])
          this.formOpton.column[i].display = true
        }else{
          this.formOpton.column[i].display = false
        }
      }
      // this.formOpton.column = temp
      this.dialogVisible = true
    },
    delHandle (row) {
      this.$confirm('此操作将永久删除此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.optype = 'delRow'
        this.$emit('delRow', row)
      }).catch(() => {

      });
    },
    // 清空多选
    clearSelect () {
      this.$refs[this.refs].clearSelection()
    },
    // 表格高度适应
    styleHeight () {
      let height = $('#app').height()
      if($('.jvs-table-titleTop') && $('.jvs-table-titleTop').length > 0) {
        height -= $('.jvs-table-titleTop').height()
      }
      if(this.showHeader) {
        height -= 55
      }
      if(this.option.page) {
        if($('.tablepagination') && $('.tablepagination').length > 0) {
          height -= ($('.tablepagination').height() + 40)
        }
      }
      $(".el-table__body-wrapper")[0].style.maxHeight = height
      $(".el-table__body-wrapper").height(height)
      if(this.option.menuFix) {
        $(".el-table__fixed-body-wrapper").height(height)
      }
    },
    doLayout(){
      let _this = this
      this.$nextTick(() => {
        console.log(_this.$refs[_this.refs])
        _this.$refs[_this.refs].doLayout()
      })
    },
    // 动态控制行数据显示
    styleRowItem (row, item, type) {
      let val = row[item.prop]
      let color = ""
      if(item.expressControl && item.expressControl.length > 0) {
        for(let i in item.expressControl) {
          if(item.expressControl[i].express) {
            let str = item.expressControl[i].express.replace(/\$\{/g,"row.")
            str = str.replace(/}/g, "")
            if(eval(str)){
              if(item.expressControl[i].text.includes('${')) {
                let ts = item.expressControl[i].text
                ts = ts.replace(/\$\{/g,"row.")
                ts = ts.replace(/}/g, "")
                if(eval(ts)) {
                  val = eval(ts)
                }
              }else{
                val = item.expressControl[i].text
              }
              color = item.expressControl[i].color
            }
          }
        }
      }
      if(type == 'color') {
        return color
      }else{
        return val
      }
    }
  },
  watch: {
    isClearSelect: {
      handler(newVal, oldVal) {
        if(newVal != 0) {
          this.clearSelect()
        }
      }
    },
    data: {
      handler(newVal, oldVal) {
        this.styleHeight()
        if(this.option.menuFix) {
          this.doLayout()
        }
      }
    },
    'option.searchLoading': {
      handler(newVal, oldVal) {
        this.$set(this.searchOption, 'submitLoading', (newVal || false))
      }
    }
  }
};
</script>
<style lang="scss">
.el-table {
  .el-table__body-wrapper {
    overflow-y: auto;
    .el-table__empty-block {
      box-sizing: border-box;
      min-height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ebebeb;
    }
  }
  .el-table__body-wrapper:hover::-webkit-scrollbar{
    height: 8px;
  }
  th{
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 600;
    color: #222222;
  }
}
.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    align-items: center;
    margin-left: 0;
  }
  .form-item-btn{
    width: auto;
  }
}
.tablepagination {
  padding: 20px 0;
  background-color: #fff;
  overflow: hidden;
  .el-pagination {
    float: right;
    padding: 0;
    margin-right: 20px;
  }
}
.table-top {
  width: 100%;
  overflow: hidden;
  .table-top-left{
    float: left;
    // margin: 10px 0;
  }
  .table-top-right {
    float: right;
    display: flex;
  }
}
.table-title{
  margin: 0;
  text-align: center;
}
// 去除斑马纹
.el-table--striped .el-table__body tr.el-table__row--striped td{
  background-color: #fff;
}
.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: #F5F7FA;
}
.jvs-table{
  .pageheader-top{
    display: none;
  }
  .el-table{
    // margin-top: 0!important;
  }
  .table-body-box{
    padding: 0 20px;
    background-color: #fff;
  }
  .jvs-table-top{
    padding: 10px;
    box-shadow: none;
    .search-form{
      margin-bottom: 10px;
    }
  }
  .el-loading-mask{
    background-image: url('../../styles/loading.gif');
    background-repeat: no-repeat;
    background-position: center;
    //background-size: 450px 360px;
    background-size: 300px 240px;
    .el-loading-spinner{
      .circular{
        display: none;
      }
    }
  }
}
// 文字提示
.el-tooltip__popper{
  max-width: 70%;
}
</style>
