<template>
  <el-button
    :size="size || defaultSet.size"
    :type="type || defaultSet.type"
    :plain="plain || defaultSet.plain"
    :round="round || defaultSet.round"
    :circle="circle || defaultSet.circle"
    :loading="loading || defaultSet.loading"
    :disabled="disabled || defaultSet.disabled"
    :icon="icon || defaultSet.icon"
    :autofocus="autofocus || defaultSet.autofocus"
    :native-type="nativeType || defaultSet.nativeType"
    v-if="$permissionMatch(permisionFlag)"
    @click="clickHandle"
  >
    <span v-if="permisionFlag">{{$permissionLabel(permisionFlag, defaultText)}}</span>
    <slot></slot>
    <!-- 其余插槽待拓展。。。。。。 -->
  </el-button>
</template>
<script>
export default {
  name: "jvs-button",
  props: {
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    permisionFlag: {
      type: String,
      default: ''
    },
    defaultText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultSet: {
        size: 'mini', // 尺寸
        type: '', // 类型
        plain: false, // 	是否朴素按钮
        round: false, // 是否圆角按钮
        circle: false, // 是否圆形按钮
        loading: false, // 是否加载中状态
        disabled: false, // 是否禁用状态
        icon: '', // 图标类名
        autofocus: false, // 是否默认聚焦
        nativeType: 'button',
        permisionFlag: '', // 权限标识
      },
    }
  },
  created () {
  },
  methods: {
    clickHandle () {
      this.$emit('click', true)
    }
  }
}
</script>