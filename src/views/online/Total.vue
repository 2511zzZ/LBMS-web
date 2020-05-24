<template>
  <div class="page-header-index-wide">

    <top-cards :level="levelParams.level" :levelId="levelParams.levelId"></top-cards>

    <monitor-charts :level="levelParams.level" :levelId="levelParams.levelId"></monitor-charts>

  </div>
</template>
<script>
import { TopCards, MonitorCharts, LevelTable } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"

export default {
  name: 'Total',
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
