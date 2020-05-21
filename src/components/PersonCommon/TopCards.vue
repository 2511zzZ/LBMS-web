<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <chart-card :loading="loading" title="在线主播数" total="6,560">
        <a-tooltip title="指标说明" slot="action">
          <a-icon type="info-circle-o" />
        </a-tooltip>
        <div>
          昨日开播主播总数  <span>12934</span>
        </div>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <chart-card :loading="loading" title="在线主播比例" total="78%">
        <a-tooltip title="指标说明" slot="action">
          <a-icon type="info-circle-o" />
        </a-tooltip>
        <div>
          <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
        </div>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <chart-card :loading="loading" title="在线观众数" :total="totalWatch | NumberFormat">
        <a-tooltip title="当前分钟在线观众数，波形图表示在线观众数变化趋势" slot="action">
          <a-icon type="info-circle-o" />
        </a-tooltip>
        <div>
          <mini-area :level="level" :levelId="levelId"/>
        </div>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <chart-card :loading="loading" title="礼物金额" :total="totalGift | NumberFormat">
        <a-tooltip title="当前分钟礼物金额，柱状图表示每分钟礼物总额" slot="action">
          <a-icon type="info-circle-o" />
        </a-tooltip>
        <div>
          <mini-bar :level="level" :levelId="levelId" />
        </div>
      </chart-card>
    </a-col>
  </a-row>
</template>

<script>
import { ChartCard, MiniArea, MiniBar, MiniProgress } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import { getLastTotalOnlineData } from '../../api/LBMSmanage'

export default {
  name: 'TopCards',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress
  },
  props: {
    level: {
      type: String,
      required: true
    },
    levelId: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: false,
      default: () => { return new Date() }
    }
  },
  data () {
    return {

      // 顶部实时数据
      totalWatch: 0,
      totalGift: 0,

      loading: true
    }
  },
  methods: {

    // todo 主播总数与开播比例数据

    // 更新顶部总览数据
    refreshTopCard() {
      if (this.level==='total') {
        getLastTotalOnlineData().then(res => {
          this.totalWatch = res.data.watchNum
          this.totalGift = res.data.gift
        })
      }
    },

  },
  created () {
    this.refreshTopCard()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
