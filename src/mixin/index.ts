import validator from '@/utils/validator'
import { SettingsModule } from '@/store/modules/settings'
import { CommonModule } from '@/store/modules/common'
const mixin = {
  data() {
    return {
      bHeight: document.body.clientHeight, // body高度
      cHeight: document.body.clientHeight - 124, // 内容高度
      isMaxScreen: window.screen.width >= 1920,
      adaptWidth: window.screen.width >= 1920 ? 16 : 12,
      globalRules: {
        required: [ { required: true, message: '字段不能为空' } ],
        required500: [
          { required: true, message: '字段不能为空' },
          { max: 500, message: '输入信息不能超过500个字', trigger: 'blur' }
        ],
        requiredInput: [
          { required: true, message: '字段不能为空' },
          { validator: validator.speChar, message: '输入信息包含特殊字符'},
          { max: 500, message: '输入信息不能超过500个字', trigger: 'blur' }
        ],
        requiredInput30: [
          { required: true, message: '字段不能为空' },
          { validator: validator.speChar, message: '输入信息包含特殊字符'},
          { max: 30, message: '输入信息不能超过30个字', trigger: 'blur' }
        ],
        requiredInput50: [
          { required: true, message: '字段不能为空' },
          { validator: validator.speChar, message: '输入信息包含特殊字符'},
          { max: 50, message: '输入信息不能超过50个字', trigger: 'blur' }
        ],
        amountInput: [
          { validator: validator.float, message: '数字类型错误'},
          { max: 30, message: '输入信息不能超过30个字', trigger: 'blur' }
        ],
        requiredAmountInput: [
          { required: true, message: '字段不能为空' },
          { validator: validator.float, message: '数字类型错误'},
          { max: 30, message: '输入信息不能超过30个字', trigger: 'blur' }
        ],
        number: [
          { validator: validator.number, message: '数字类型错误'},
          { max: 30, message: '输入信息不能超过30个字', trigger: 'blur' }
        ],
        requiredNumber: [
          { required: true, message: '字段不能为空' },
          { validator: validator.number, message: '数字类型错误'},
          { max: 30, message: '输入信息不能超过30个字', trigger: 'blur' }
        ],
        requiredOrderNumber: [
          { required: true, message: '字段不能为空' },
          { validator: validator.orderNumber}
        ],
        input: [
          { validator: validator.speChar, message: '输入信息包含特殊字符'},
          { max: 500, message: '输入信息不能超过500个字', trigger: 'blur' }
        ],
        input500: [
          { max: 500, message: '输入信息不能超过500个字', trigger: 'blur' }
        ],
        desc: [
          { max: 100, message: '输入信息不能超过100个字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    theme() {
      return SettingsModule.theme
    },
    themeType() {
      return SettingsModule.themeType
    }
  }
}

export default mixin;
