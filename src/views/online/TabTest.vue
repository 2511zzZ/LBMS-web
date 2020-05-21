<template>
  <div class="page-header-index-wide">

    <top-cards :level="levelParams.level" :levelId="levelParams.levelId"></top-cards>

    <a-radio-group v-model="currentTab" :style="{ marginBottom: '0px' }">
      <a-radio-button value="search">搜索</a-radio-button>
      <a-radio-button value="monitor">监控</a-radio-button>
    </a-radio-group>

    <a-tabs v-model="currentTab" ref="topTab">
      <a-tab-pane key="search">
        <level-table :level="levelParams.level" :levelId="levelParams.levelId"></level-table>
      </a-tab-pane>
      <a-tab-pane key="monitor">
        <monitor-charts :level="levelParams.level" :levelId="levelParams.levelId"></monitor-charts>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>
<script>
import { TopCards, MonitorCharts, LevelTable } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    TopCards,
    MonitorCharts,
    LevelTable
  },
  data () {
    return {
      // 层级数据
      levelParams: {
        level: 'total',
        levelId: 1
      },

      // 搜索/监控 tab标签
      currentTab: 'monitor',

      // 一秒加载动画
      loading: true

    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

