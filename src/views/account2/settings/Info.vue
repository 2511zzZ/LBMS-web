<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical">
          <a-form-item
            label="昵称"
          >
            <a-input
              v-model="nickname"
              v-decorator="['nickname']"/>
          </a-form-item>
          <a-form-item
            label="姓名"
          >
            <a-input v-model="name" disabled/>
          </a-form-item>
          <a-form-item
            label="员工号"
          >
            <a-input v-model="employee_id" disabled/>
          </a-form-item>
          <a-form-item
            label="性别"
          >
            <a-input v-model="sex" disabled/>
          </a-form-item>
          <a-form-item
            label="出生日期"
          >
            <a-date-picker v-model="birthday" disabled/>
          </a-form-item>
          <a-form-item
            label="籍贯"
          >
            <a-input v-model="birthplace" disabled/>
          </a-form-item>

          <a-form-item>
            <a-button htmlType="submit" type="primary" @click="submit">提交</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setavatar" @fileOk="setFile"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import moment from 'moment'
import { getUserDetails, changeUserDetails } from '../../../api/LBMSmanage'

export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      name: '',
      nickname: '',
      sex: '',
      birthday: null,
      birthplace: 'xx省',
      employee_id: 0,
      preview: {},
      option: {
        img: this.$store.state.user.avatar,
        info: true,
        size: 1,
        file: null,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  methods: {
    setavatar (url) {
      this.option.img = url
    },
    setFile (file) {
      this.option.file = file
    },
    submit () {
      // const fb = new FormData()
      // fb.append('nickname', this.nickname)
      // if (this.option.file) {
      //   fb.append('avatar', this.option.file)
      // }
      // todo: 头像上传
      const parameters = {
        nickname: this.nickname
      }
      changeUserDetails(parameters).then(res => {
        this.$message.success('修改成功!')
        this.$store.commit('SET_AVATAR', this.option.img)
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败!')
      })
    }
  },
  created () {
    getUserDetails().then(res => {
      const msg = res.data
      this.name = msg.name
      this.nickname = msg.nickname
      this.sex = msg.gender
      // this.birthday = moment(msg.birthday, 'YYYY-MM-DD')
      // this.birthplace = msg.birthplace
      this.employee_id = msg.employeeId
    })
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
