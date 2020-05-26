<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <chart-card :loading="loading" title="在线主播数" :total="OnlineAnchorNum">
        <a-tooltip title="指标说明" slot="action">
          <a-icon type="info-circle-o" />
        </a-tooltip>
        <div>
          昨日开播主播总数  <span>{{yesterdayAnchorSum}}</span>
        </div>
      </chart-card>
    </a-col>
    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <chart-card :loading="loading" title="在线主播比例" :total="OnlineAnchorPercent">
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
import { getTopCardsData } from '../../api/LBMSmanage'
import store from '../../store'

export default {
  name: 'TopCards',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress
  },
  data () {
    return {

      level: 'team',
      levelId: 1,
      // 顶部实时数据
      OnlineAnchorNum: 0,
      OnlineAnchorPercent: '',
      yesterdayAnchorSum: 0,
      totalWatch: 0,
      totalGift: 0,

      loading: true
    }
  },
  methods: {
    // 更新顶部总览数据
    refreshTopCard() {
      getTopCardsData().then(res => {
        this.OnlineAnchorNum = res.data.onlineAnchorNum
        this.yesterdayAnchorSum = res.data.yesterdayOnlineAnchorNum
        this.OnlineAnchorPercent = res.data.onlineAnchorPercent + '%'
        this.totalWatch = res.data.onlineWatcher
        this.totalGift = res.data.giftNum
      })
    },

    getLevel() {
      if (store.getters.roleNum===1){
        this.level = 'total'
      }
      if (store.getters.roleNum===2){
        this.level = 'branch'
      }
      if (store.getters.roleNum===3){
        this.level = 'group'
      }
      if (store.getters.roleNum===4){
        this.level = 'team'
      }
      this.levelId = store.getters.levelNum
    },

  },
  created () {
    this.getLevel()
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
