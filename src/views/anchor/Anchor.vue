<template>
  <div>
    <a-radio-group v-model="currentTab" :style="{ marginBottom: '0px' }">
      <a-radio-button value="search">搜索</a-radio-button>
      <a-radio-button value="manage" :disabled="disabled">管理</a-radio-button>
    </a-radio-group>

    <a-tabs v-model="currentTab">
      <a-tab-pane key="search" tab="">
        <level-table
          :level="monitorParams.level"
          :levelId="monitorParams.levelId"
          @onClick="turnToManage"></level-table>
      </a-tab-pane>
      <a-tab-pane key="manage" tab="">
        <a-card>
          <a-col :md="24" :lg="12">

            <a-form layout="vertical">
              <a-form-item
              label="主播编号"
            >
              <a-input v-model="anchorId" disabled/>
            </a-form-item>
              <a-form-item
                label="主播姓名"
              >
                <a-input v-model="name" disabled/>
              </a-form-item>
              <a-form-item
              label="主播昵称"
            >
              <a-input
                v-model="nickname"/>
            </a-form-item>
              <a-form-item
                label="主播房间号"
              >
                <a-input
                  v-model="roomId"/>
              </a-form-item>
              <a-form-item
                label="手机号"
              >
                <a-input
                  v-model="phone" disabled/>
              </a-form-item>

              <a-form-item>
                <a-button htmlType="submit" type="primary" @click="submit">修改</a-button>
                <a-button htmlType="submit" type="danger" @click="banAnchor" style="margin-left: 10px;">
                  封禁
                </a-button>
              </a-form-item>
            </a-form>

          </a-col>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { LevelTable } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"
import { banAnchorById, getAnchor, changeAnchor } from '../../api/LBMSmanage'

export default {
  name: 'Anchor',
  mixins: [mixinDevice],
  components: {
    LevelTable
  },
  data () {
    return {

      anchorId: 0,
      name: '',
      nickname: '',
      roomId: '',
      phone: '',


      monitorParams: {
        level: 'anchor',
        levelId: 1 // any value
      },
      // 搜索/监控 tab标签
      currentTab: 'search',
      // 一秒加载动画
      loading: true,
      disabled: true
    }
  },
  methods: {
    turnToManage (record) {
      this.disabled = false
      this.currentTab = 'manage'
      this.monitorParams.levelId = record
      console.log(record)
      getAnchor({ anchorId: record }).then(res => {
        const anchor = res.data
        this.anchorId = anchor.anchorId
        this.name = anchor.name
        this.roomId = anchor.roomId
        this.nickname = anchor.nickname
        this.phone = anchor.phone
      })

    },
    submit() {
      const parameters = {
        anchorId: this.anchorId,
        roomId: this.roomId,
        nickname: this.nickname
      }
      changeAnchor(parameters).then(res => {
        this.$message.success("修改成功")
        getAnchor({ anchorId: parameters.anchorId })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    banAnchor() {
      banAnchorById({ anchorId: this.anchorId }).then(res => {
        this.$message.success("封禁成功")
      })
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

