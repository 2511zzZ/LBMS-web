<template>
  <div>
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
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
      title="修改检测时间"
      :confirmLoading="percentConfirmLoading"
      v-model="percentVisible"
      @ok="handlePercentOk"
    >
      {{ '时间:'+this.interval+'分钟 => ' }}
      <input ref="getInterval"/>
    </a-modal>
    <a-modal
      title="修改举报数阈值"
      :confirmLoading="durationConfirmLoading"
      v-model="durationVisible"
      @ok="handleDurationOk"
    >
      {{ '次数:'+this.maxAlarmNum+' => ' }}
      <input ref="getMaxAlarmNum"/>
    </a-modal>
  </div>
</template>

<script>
import { getAlarmThreshold, getMaxAlarmNum, setAlarmConfig } from '../../../api/LBMSmanage'

export default {
  data () {
    return {
      percentConfirmLoading: false,
      durationConfirmLoading: false,
      percentVisible: false,
      durationVisible: false,

      interval: 3,
      maxAlarmNum: 100,
      data: [
        { title: '举报检测时间', description: '系统将检测该段时间内的举报数', unit: '分钟', actions: { title: '修改', callback: this.showPercentModal } },
        { title: '警报发起阈值', description: '一定时间内举报数量超过该值系统将发起警报', unit: '次', actions: { title: '修改', callback: this.showDurationModal } }
      ]
    }
  },
  created: function () {
    getAlarmThreshold().then(res => {
        this.interval = res.data
    })
    getMaxAlarmNum().then(res => {
      this.maxAlarmNum = res.data
    })
  },
  methods: {
    showPercentModal () {
      this.percentVisible = true
    },
    showDurationModal () {
      this.durationVisible = true
    },
    handlePercentOk (e) {
      this.percentConfirmLoading = true
      const newThreshold = this.$refs.getInterval.value
      this.$refs.getInterval.value = null
      const parameters = { newThreshold: newThreshold, maxTipNum: this.maxAlarmNum }
      setAlarmConfig(parameters).then(res => {
        this.percentVisible = false
        this.percentConfirmLoading = false
        this.$message.success('修改成功')
        this.interval = newThreshold
      }).catch(() => {
        this.$message.error('设置出错')
        this.percentConfirmLoading = false
      })
    },
    handleDurationOk (e) {
      this.durationConfirmLoading = true
      const newMaxNum = this.$refs.getMaxAlarmNum.value
      this.$refs.getMaxAlarmNum.value = null
      const parameters = { newThreshold: this.interval, maxTipNum: newMaxNum }
      setAlarmConfig(parameters).then(res => {
        this.durationVisible = false
        this.durationConfirmLoading = false
        this.$message.success('修改成功')
        this.maxAlarmNum = newMaxNum
      }).catch(() => {
        this.$message.error('设置出错')
        this.durationConfirmLoading = false
      })
    },
  }
}
</script>

<style scoped>

</style>
