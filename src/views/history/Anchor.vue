<template>
  <div class="page-header-index-wide">

    <a-radio-group v-model="currentTab" :style="{ marginBottom: '0px' }">
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
        <history-charts
          v-if="monitorAlive"
          :level="monitorParams.level"
          :levelId="monitorParams.levelId"></history-charts>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>
<script>
import { TopCards, HistoryCharts, LevelTable } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"

export default {
  name: 'Team',
  mixins: [mixinDevice],
  components: {
    TopCards,
    HistoryCharts,
    LevelTable
  },
  data () {
    return {

      monitorAlive:true,
      // 层级数据
      tableParams: {
        level: 'total',
        levelId: 1
      },
      monitorParams: {
        level: 'anchor',
        levelId: 1
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
      this.monitorParams.level = 'anchor'
      this.monitorParams.levelId = record

      this.monitorAlive = false
      this.$nextTick(() => (this.monitorAlive = true))
    },
  },
  created () {
    console.log(this.monitorParams.level)
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

