<template>
  <a-card :bordered="false">
    <div class="account-settings-info-view">
      <a-col :md="24" :lg="10">
        <a-form layout="vertical" @submit="handleSubmit" :form="form">

          <a-form-item label="当前密码:">
            <a-input
              type="password"
              autocomplete="false"
              placeholder="请输入当前密码"
              v-decorator="[
                'oldPassword',
                {rules: [{ required: true, message: '请输入旧密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item label="新密码:">
            <a-input
              type="password"
              autocomplete="false"
              placeholder="请输入新密码"
              v-decorator="[
                'newPassword',
                {rules: [{ required: true, message: '请输入新密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item label="再次输入新密码:">
            <a-input
              type="password"
              autocomplete="false"
              placeholder="请再次输入新密码"
              v-decorator="[
                'repetitionPassword',
                {rules: [{ required: true, message: '请再次输入新密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button htmlType="submit" type="primary">提交</a-button>
          </a-form-item>
        </a-form>

      </a-col>
    </div>
  </a-card>
</template>

<script>
import { changePassword } from '../../../api/LBMSmanage'
import { mapActions } from 'vuex'
import md5 from 'md5'

export default {
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPassword !== values.repetitionPassword) {
            this.$message.error('两次输入的密码不一致!')
          } else if (values.newPassword.length < 6) {
            this.$message.error('新密码的长度不能少于6位!')
          } else {
            const parameters = {
              oldPassword: md5(values.oldPassword),
              newPassword: md5(values.newPassword)
            }
            changePassword(parameters).then(res => {
              this.$message.success('修改成功!请重新登录')
              this.Logout({}).then(() => {
                setTimeout(() => {
                  window.location.reload()
                }, 16)
              })
            }).catch(() => {
              this.$message.error('密码错误, 修改失败!')
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
