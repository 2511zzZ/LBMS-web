<template>
  <div>
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title" v-if="item.title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>

      </a-list-item>
    </a-list>
    <a-modal
      title="修改超时传递时间"
      :confirmLoading="transmitConfirmLoading"
      v-model="transmitVisible"
      @ok="handleTransmitOk"
    >
      {{ '超时传递时间:'+this.transmitTime+'分钟 => ' }}
      <input ref="getTransmitValue"/>
    </a-modal>
  </div>
</template>

<script>
import { getAlarmTransTime, setAlarmTransTime } from '../../../api/LBMSmanage'

export default {
  data () {
    return {
      transmitTime: 0,
      totalTransmitTime: 0,
      transmitConfirmLoading: false,
      totalTransmitConfirmLoading: false,
      transmitVisible: false,
      totalTransmitVisible: false,
      data: [
        { title: '超时传递时间', description: '当前层级一段时间未处理的警报将会传到下一级', unit: '分钟', actions: { title: '修改', callback: this.showTransmitModal } },
      ]
    }
  },
  created: function () {
    getAlarmTransTime().then(res => {
      this.transmitTime = res.data
      this.data[0].title = this.data[0].title + ' : ' + this.transmitTime + '分钟'
      this.data[0].description = '超过' + this.transmitTime + '分钟未处理警报将会传给下一级'
    })
  },
  methods: {
    showTransmitModal () {
      this.transmitVisible = true
    },
    handleTransmitOk (e) {
      this.transmitConfirmLoading = true
      const newTransmitValue = parseInt(this.$refs.getTransmitValue.value)
      this.$refs.getTransmitValue.value = null
      const parameters = { transTime: newTransmitValue }
      setAlarmTransTime(parameters).then(res => {
        this.transmitVisible = false
        this.transmitConfirmLoading = false
        this.$message.success('修改成功')
        this.transmitTime = newTransmitValue
        this.data[0].title = '超时传递时间' + ' : ' + this.transmitTime + '分钟'
        this.data[0].description = '超过' + this.transmitTime + '分钟未处理警报将会传给下一级'
      }).catch(() => {
        this.$message.error('设置出错')
        this.transmitConfirmLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
