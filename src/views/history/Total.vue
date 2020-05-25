<template>
  <history-charts :level="levelParams.level" :levelId="levelParams.levelId"></history-charts>
</template>
<script>
import { TopCards, LevelTable, HistoryCharts } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"

export default {
  name: 'TotalHistory',
  mixins: [mixinDevice],
  components: {
    HistoryCharts,
    TopCards,
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
