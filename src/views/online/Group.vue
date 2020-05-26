<template>
  <div class="page-header-index-wide">

    <top-cards></top-cards>

    <a-radio-group v-model="currentTab" :style="{ marginBottom: '0px' }" v-if="radioShow">
      <a-radio-button value="search">搜索</a-radio-button>
      <a-radio-button value="monitor" :disabled="disabled">监控</a-radio-button>
    </a-radio-group>

    <a-tabs v-model="currentTab">
      <a-tab-pane key="search" tab="">
        <level-table
          :level="monitorParams.level"
          :levelId="monitorParams.levelId"
          @onClick="turnToMonitor"></level-table>
      </a-tab-pane>
      <a-tab-pane key="monitor" tab="">
        <monitor-charts
          v-if="monitorAlive"
          :level="monitorParams.level"
          :levelId="monitorParams.levelId"></monitor-charts>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>
<script>
import { TopCards, MonitorCharts, LevelTable } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"
import store from '../../store'
import { getLevelId } from '../../api/LBMSmanage'

export default {
  name: 'Group',
  mixins: [mixinDevice],
  components: {
    TopCards,
    MonitorCharts,
    LevelTable
  },
  data () {
    return {

      monitorAlive:true,
      radioShow: true,
      monitorParams: {
        level: 'group',
        levelId: store.getters.levelNum
      },

      // 搜索/监控 tab标签
      currentTab: 'search',

      // 一秒加载动画
      loading: true,
      disabled: true
    }
  },
  methods: {
    turnToMonitor (record) {
      this.disabled = false
      this.currentTab = 'monitor'
      this.monitorParams.level = 'group'
      this.monitorParams.levelId = record

      this.monitorAlive = false
      this.$nextTick(() => (this.monitorAlive = true))
    }
  },
  created () {
    if (store.getters.roleNum===3){
      this.radioShow = false
      this.currentTab = 'monitor'
    }
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

