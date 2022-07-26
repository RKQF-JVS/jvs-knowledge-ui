<template>
  <div class="html-design">
    <el-tiptap
      height="100%"
      :extensions="extensions"
      :content="content"
      @onUpdate="onUpdate"
      :spellcheck="false"
      :menu-bubble-options="{ 'keep-in-bounds': false }"
      placeholder="请输入内容"
    />
  </div>
</template>

<script>
import {
  Iframe,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  Link,
  Image,
  Blockquote,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  Indent,
  HardBreak,
  HorizontalRule,
  CodeView,
  Fullscreen,
  History,
} from 'element-tiptap';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'; // import base style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js'; // autoCloseTags
import {myHeading} from '@/views/common/tiptap/extension'
export default {
  props: {
    content: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data () {
    return {
      extensions: [
        new Iframe(),
        new Doc(),
        new Text(),
        new Paragraph(),
        new myHeading({ level: 5,bubble: true }),
        // new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true }),
        new Italic({ bubble: true }),
        new Strike({ bubble: true }),
        new Code(),
        new Link({ bubble: true }),
        new Image(),
        new Blockquote(),
        new TextAlign(),
        new ListItem(),
        new BulletList({ bubble: true }),
        new OrderedList({ bubble: true }),
        new TodoItem(),
        new TodoList(),
        new Indent(),
        new HardBreak(),
        new HorizontalRule({ bubble: true }),
        new CodeView({
          codemirror,
          codemirrorOptions: {
            styleActiveLine: true,
            autoCloseTags: true,
          },
        }),
        new Fullscreen(),
        new History(),
      ],
      html:'',
    };
  },
  // mounted(){
  //   console.log(this.content)
  // },
  methods: {
    onUpdate (output, options) {
      const {getHTML} = options;
      this.html = getHTML();
      // console.log(this.html)
      this.$emit("contetnChange",this.html)
    },
  }
};
</script>
<style lang="scss">
.html-design{
  height: 100%;
  width: 100%;
  // #contentBox{
  //   height: 100%;
  //   .w-e-toolbar, .w-e-text-container{
  //     border: 0!important;
  //   }
  //   .w-e-text-container{
  //     height: 100%!important;
  //     box-shadow: 0 0 10px #DFDFDF;
  //   }
  // }
}
</style>
