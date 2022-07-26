<template>
  <div class="hello">
    <div style="position: absolute; top: 0">
      <!-- <input style="font-size: 16px" type="file" @change="uploadExcel" /> -->
    </div>
    <div
      id="luckysheet"
      style="
        padding: 0px;
        position: absolute;
        width: 100%;
        height:650px;
        left: 0px;
        top: 0px;
        bottom: 0px;
      "
    ></div>

    <div
      v-show="isMaskShow"
      style="
        position: absolute;
        z-index: 1000000;
        left: 0px;
        top: 0px;
        bottom: 0px;
        right: 0px;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 40px;
        align-items: center;
        justify-content: center;
        display: flex;
      "
    >
      Downloading
    </div>
  </div>
</template>

<script>
import LuckyExcel from "luckyexcel";
export default {
  name: "Excel",
  props: {
    content: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
        // content:'',
        isMaskShow: false,
    };
  },
  mounted() {
    this.cj();
  },
  methods: {
    cj() {
      let _this = this;
      var options={
        container: "luckysheet",
        lang:'zh',
        showGridLines:true,
        allowEdit:true,
        showinfobar: false, // 是否显示顶部信息栏
        showsheetbar: true, // 是否显示底部sheet页按钮
        showstatisticBar: false, // 是否显示底部计数栏
        sheetBottomConfig: true, // sheet页下方的添加行按钮和回到顶部按钮配置
        userInfo: false, // 右上角的用户信息展示样式
        plugins: ['chart'],
        showstatisticBarConfig: {
          count:true,
          view:true,
          zoom:true,
        },
        showsheetbarConfig: {
          add: true, //新增sheet
          menu: false, //sheet管理菜单
          sheet: true, //sheet页显示
        },
        hook: {
          sheetMouseup(){
            _this.$emit("contetnChange", luckysheet.getAllSheets());
          },
        }
      }
      if(this.content==''){
        // luckysheet.create(options);
        luckysheet.create({
          ...options,
          data: [
            {
              "name": "Sheet1",
              "color": "",
              "index": 1,
              "status": 0,
              "order": 1,
              "celldata": [],
              "config": {}
            },
          ],
        });
      }else{
        luckysheet.create({
          ...options,
          data: this.content,
        });
      }
    },
    uploadExcel(evt) {
      let _this = this;
      const files = evt.target.files;
      if (files == null || files.length == 0) {
        alert("No files wait for import");
        return;
      }

      let name = files[0].name;
      let suffixArr = name.split("."),
        suffix = suffixArr[suffixArr.length - 1];
      if (suffix != "xlsx") {
        alert("Currently only supports the import of xlsx files");
        return;
      }
      LuckyExcel.transformExcelToLucky(
        files[0],
        function (exportJson, luckysheetfile) {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert(
              "Failed to read the content of the excel file, currently does not support xls files!"
            );
            return;
          }
          window.luckysheet.destroy();
          var options={
            container: "luckysheet",
            lang:'zh',
            showGridLines:true,
            allowEdit:true,
            showinfobar: false, // 是否显示顶部信息栏
            showsheetbar: true, // 是否显示底部sheet页按钮
            showstatisticBar: false, // 是否显示底部计数栏
            sheetBottomConfig: true, // sheet页下方的添加行按钮和回到顶部按钮配置
            userInfo: false, // 右上角的用户信息展示样式
            plugins: ['chart'],
            showstatisticBarConfig: {
              count:true,
              view:true,
              zoom:true,
            },
            showsheetbarConfig: {
              add: true, //新增sheet
              menu: false, //sheet管理菜单
              sheet: true, //sheet页显示
            },
            hook: {
              sheetMouseup(){
                _this.$emit("contetnChange", luckysheet.getAllSheets());
              },
            }
          }
          luckysheet.create({
            ...options,
            data: exportJson.sheets,
          })
        }
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hello{
  min-height: 650px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>