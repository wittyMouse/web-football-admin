<template>
  <div class="login">
    <section class="login__content">
      <div class="login-title">
        <img
          class="login-title__logo"
          :src="require('../assets/images/logo.svg')"
        />
        <span class="login-title__text">巅峰后台</span>
      </div>
      <div class="login-form">
        <a-form
          :form="form"
          layout="horizontal"
          autocomplete="off"
          @submit.prevent="handleSubmit"
        >
          <a-form-item>
            <a-input
              size="large"
              v-decorator="['userName', { rules: rules.userName }]"
              placeholder="请输入用户名"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0, 0, 0, .25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              v-decorator="['password', { rules: rules.password }]"
              type="password"
              placeholder="请输入密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0, 0, 0, .25)"
              />
            </a-input>
          </a-form-item>
          <a-row :gutter="0">
            <a-col :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  v-decorator="['inputCode', { rules: rules.inputCode }]"
                  placeholder="请输入验证码"
                >
                  <a-icon
                    slot="prefix"
                    type="safety"
                    style="color: rgba(0, 0, 0, .25)"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="check-code" :span="8">
              <img
                v-if="checkCodeImage"
                class="check-code__inner"
                :src="checkCodeImage"
                @click="handleCheckCodeRefresh"
              />
              <div
                v-else
                :class="
                  loadCheckCode ? 'check-code__loading' : 'check-code__error'
                "
                @click="handleCheckCodeRefresh"
              >
                <a-icon v-if="loadCheckCode" type="loading-3-quarters" spin />
              </div>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button
              class="login-form__submit"
              type="primary"
              size="large"
              html-type="submit"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </section>

    <a-modal
      :visible="GAConfig.isShow && !GAConfig.isBind"
      :width="400"
      :bodyStyle="{ textAlign: 'center' }"
      destroyOnClose
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :afterClose="handleGABindAfterClose"
      @cancel="handleGABindClose"
    >
      <div class="GA-bind-title">绑定谷歌验证码</div>
      <img :src="GAConfig.image" />
      <div class="GA-bind-text">
        (当前谷歌扫码绑定必须完成操作，如未完成绑定关掉页面将需要联系超级管理员将谷歌验证码重置)
      </div>
    </a-modal>

    <a-modal
      :visible="GAConfig.isShow && GAConfig.isBind"
      :width="300"
      :footer="null"
      destroyOnClose
      :keyboard="false"
      :maskClosable="false"
      :confirmLoading="GAConfig.loading"
      :afterClose="handleGAFormAfterClose"
      @cancel="handleGAClose"
    >
      <a-form
        class="GA-form"
        :form="gaForm"
        autocomplete="off"
        @submit.prevent="handleGAConfirm"
      >
        <a-form-item label="谷歌验证码">
          <a-input
            ref="input"
            allowClear
            v-decorator="[
              'gaCode',
              {
                initialValue: '',
                rules: rules.gaCode
              }
            ]"
            placeholder="请输入谷歌验证码"
            :maxLength="6"
          />
        </a-form-item>
        <div class="GA-form-footer">
          <a-button @click="handleGAClose">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api'
import { mapState, mapActions } from 'vuex'
import { setData, setToken } from '@/utils'
import { onlyNumber } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validatorGaCode = (rule, value, callback) => {
      if (value && !onlyNumber(value)) {
        callback(new Error('谷歌验证码只能输入数字'))
      } else if (value && value.length !== 6) {
        callback(new Error('请输入6位谷歌验证码'))
      } else {
        callback()
      }
    }
    return {
      form: this.$form.createForm(this),
      // 用于获取验证码和校验表单的时间戳
      currTimestamp: '',
      // 验证码图片路径
      checkCodeImage: '',
      // 获取验证码请求状态
      loadCheckCode: false,
      // 表单提交请求状态
      loadSubmit: false,
      // 表单校验规则
      rules: {
        userName: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        inputCode: [{ required: true, message: '请输入验证码' }],
        gaCode: [
          { required: true, message: '请输入谷歌验证码' },
          { validator: validatorGaCode }
        ]
      },
      gaForm: this.$form.createForm(this),
      // GA验证码配置
      GAConfig: {
        // GA验证码校验请求状态
        loading: false,
        // GA验证码显示状态
        isShow: false,
        // 是否绑定GA验证码
        isBind: false,
        // 绑定GA验证码的二维码
        image: '',
        // 用户ID用来校验GA验证码
        userId: ''
      },
      // GA校验码校验成功状态
      isLogin: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['updateUserInfo']),

    // 获取验证码
    getCheckCode() {
      this.loadCheckCode = true
      this.checkCodeImage = ''
      this.currTimestamp = Date.now()
      api
        .getCheckCode(this.currTimestamp)
        .then(res => {
          if (res.success) {
            this.checkCodeImage = res.result
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.loadCheckCode = false
        })
    },

    // 更新验证码
    handleCheckCodeRefresh() {
      if (this.loadCheckCode) {
        return
      }
      this.getCheckCode()
    },

    // 提交登录表单
    handleSubmit() {
      if (this.loadSubmit) {
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loadSubmit = true
          const data = {
            username: values.userName,
            password: values.password,
            remember_me: false,
            captcha: values.inputCode,
            checkKey: this.currTimestamp
          }

          this.login(data)
        }
      })
    },

    // 登录逻辑
    login(data) {
      api
        .login(data)
        .then(res => {
          if (res.success) {
            // if (res.result.userInfo.gaFlag === 0) {
            setToken(res.result.token)
            setData('userInfo', JSON.stringify(res.result.userInfo))
            this.updateUserInfo(res.result.userInfo)
            this.$_message.success('登录成功')
            this.$router.push({ path: '/' })
            // } else {
            //   if (res.result.gaImage) {
            //     this.GAConfig.userId = res.result.userInfo.id
            //     this.GAConfig.isBind = false
            //     this.GAConfig.image = `data:image/png;base64,${res.result.gaImage}`
            //   } else {
            //     this.GAConfig.userId = res.result.userInfo.id
            //     this.GAConfig.isBind = true
            //     this.$nextTick().then(() => {
            //       this.$refs['input'].focus()
            //     })
            //   }
            //   this.GAConfig.isShow = true
            // }
          } else {
            this.$_message.error(res.message)
            this.form.resetFields(['inputCode'])
            this.getCheckCode()
          }
        })
        .finally(() => {
          this.loadSubmit = false
        })
    },

    // GA绑定窗口完全关闭后的回调
    handleGABindAfterClose() {},

    // 关闭GA绑定窗口
    handleGABindClose() {
      this.$confirm({
        title: '提示',
        content: '请确认是否已绑定谷歌验证码',
        keyboard: false,
        cancelText: '返回',
        okText: '已绑定',
        onOk: () => {
          this.GAConfig.isBind = true
          this.$nextTick().then(() => {
            this.$refs['input'].focus()
          })
        }
      })
    },

    // GA验证表单完全关闭后的回调
    handleGAFormAfterClose() {
      if (this.isLogin) {
        this.isLogin = false
        this.$router.push({ name: 'dashboard' })
      } else {
        this.gaForm.resetFields()
        this.form.resetFields(['inputCode'])
        this.getCheckCode()
      }
    },

    // 关闭GA验证码
    handleGAClose() {
      this.GAConfig.isShow = false
    },

    // 提交GA验证码
    handleGAConfirm() {
      this.gaForm.validateFields((errors, values) => {
        if (errors) {
          return
        }
        const { gaCode } = values

        const data = {
          userId: this.GAConfig.userId,
          gaCode
        }
        this.GAConfig.loading = true
        api
          .checkGaCode(data)
          .then(res => {
            if (res.success) {
              setToken(res.result.token)
              setData('userInfo', JSON.stringify(res.result.userInfo))
              this.updateUserInfo(res.result.userInfo)
              this.$_message.success('登录成功')
              this.isLogin = true
              this.GAConfig.isShow = false
            } else {
              this.$_message.error(res.message)
            }
          })
          .finally(() => {
            this.GAConfig.loading = false
          })
      })
    }
  },
  mounted() {
    this.getCheckCode()
  }
}
</script>

<style lang="less">
.login {
  padding-top: 40px;
  height: 100%;
  background: #f0f2f5;

  &.ant-layout {
    @media (min-width: 768px) {
      background-image: url('../assets/images/background.svg');
    }
  }
}

.login__content {
  padding: 32px 0;

  @media (min-width: 768px) {
    padding: 32px 0 24px;
    background-image: url('../assets/images/background.svg');
  }
}

.login-title {
  margin-bottom: 40px;
  height: 44px;
  text-align: center;
  line-height: 44px;

  .login-title__logo {
    margin-right: 16px;
    height: 44px;
    vertical-align: top;
  }

  .login-title__text {
    position: relative;
    top: 2px;
    font-size: 33px;
    font-weight: 600;
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    color: rgba(0, 0, 0, 0.85);
  }
}

.login-form {
  margin: 0 auto;
  max-width: 368px;

  @media screen and (max-width: 576px) {
    width: 95%;
  }
}

.login-form__submit {
  width: 100%;
}

.check-code {
  padding: 2.5px 0;
  font-size: 0;
  text-align: right;
}

.check-code__inner,
.check-code__loading,
.check-code__error {
  display: inline-block;
  width: 105px;
  height: 35px;
  cursor: pointer;
}

.check-code__loading {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  cursor: default;

  .anticon {
    font-size: 24px;
  }
}

.check-code__error {
  background-image: url('../assets/images/checkcode.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 105px 35px;
}

.GA-bind-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  line-height: 22px;
  word-wrap: break-word;
}

.GA-bind-text {
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #f5222d;
  text-align: left;
  line-height: 22px;
  word-wrap: break-word;
}

.GA-form {
  .GA-form-footer {
    text-align: center;
  }
}
</style>
