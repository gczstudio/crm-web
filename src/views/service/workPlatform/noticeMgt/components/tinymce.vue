<template>
  <div>
    <myEditor id="tinymce" :disabled="edit" v-model="values" @input="change" :init="init"></myEditor>
  </div>
</template>

<script>
import tinymce from "tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default";
// import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
export default {
  name: "Tinymce",
  data() {
    return {
      // content: "请输入内容",
      values: this.content,
      init: {
        // 富文本参数
        language_url: "./static/tinymce/zh_CN.js",
        language: "zh_CN",
        skin_url: "./static/tinymce/skins/ui/oxide",
        height: 500,
        plugins: "link image lists table wordcount code",
        toolbar:
          "fontselect fontsizeselect link lineheight forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image quicklink h2 h3 blockquote table numlist bullist preview fullscreen,'fontsizeselect fontselect'",
        branding: false,
        font_formats:
          "宋体=宋体;黑体=黑体;仿宋=仿宋;微软雅黑=微软雅黑;Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n;",
        setup: (editor) => {
          editor.on("focus", (e) => {
            if (this.values == "请输入内容" ) {
              this.values = "";
            }
          });
        },
      },
    };
  },
  props: {
    content: {
      default: "",
    },
    edit: {
      default: "false",
    },
  },
  mounted() {
    tinymce.init({});
  },
  watch: {
    content(val) {
      this.values = val;
    },
  },
  components: { myEditor: Editor }, // 富文本组件注册
  mounted() {},
  methods: {
    change() {
      this.$emit("input", this.values);
      // console.log(this.values);
    },
    focus() {
      // console.log('focus');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>