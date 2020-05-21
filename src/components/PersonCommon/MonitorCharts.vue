<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="观看人数" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <ve-line :data="onlineWatchData" :settings="watchChartSettings" :title="onlineTitle"></ve-line>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="分区实时排行" :list="branchWatchRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="礼物数" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <ve-line :data="onlineGiftData" :settings="giftChartSettings"></ve-line>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="分区实时排行" :list="branchGiftRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="弹幕数" key="3">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <ve-line :data="onlineBulletData" :settings="bulletChartSettings"></ve-line>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="分区实时排行" :list="branchBulletRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <a-range-picker :style="{width: '256px'}"
                            :default-value="[moment(new Date(), dateFormat).add(-1, 'months'), moment(new Date(), dateFormat)]"
                            @change="historyTimeChanged"
            />
          </div>
          <a-tab-pane loading="true" tab="观看人数" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <ve-line :data="historyWatchData" :settings="chartSettings" :title="historyTitle"></ve-line>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="分区历史排行" :list="branchHistoryWatchRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="礼物数" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <ve-line :data="historyGiftData" :settings="chartSettings" :title="noDataTitle"></ve-line>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="分区历史排行" :list="branchHistoryGiftRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="弹幕数" key="3">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <ve-line :data="historyBulletData" :settings="chartSettings" :title="noDataTitle"></ve-line>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="分区历史排行" :list="branchHistoryBulletRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { RankList, Bar, Trend, NumberInfo, MiniSmoothArea, STable, Ellipsis } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"
import { getTotalOnlineData, getBranchRank, getTotalHistoryData, getBranchHistoryRank } from '../../api/LBMSmanage'

export default {
  name: 'MonitorCharts',
  mixins: [mixinDevice],
  components: {
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    STable,
    Ellipsis
  },
  props: {
    level: {
      type: String,
      required: true
    },
    levelId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {

      parameters: {},

      // 一秒加载动画
      loading: true,

      // 折线图设置项
      chartSettings: {
        // https://v-charts.js.org/#/line
      },

      dateFormat: 'YYYY/MM/DD',

      // 折线图标题
      onlineTitle: { text: '实时数据' },
      historyTitle: { text: '历史数据' },
      noDataTitle: {},

      // 实时数据
      onlineDataRows: [],
      onlineWatchData: {
        columns: ['时间', '观看人数', '昨日平均观看人数', '昨日最大观看人数'],
        rows: []
      },
      onlineGiftData: {
        columns: ['时间', '礼物数', '昨日平均礼物数'],
        rows: []
      },
      onlineBulletData: {
        columns: ['时间', '弹幕数', '昨日平均弹幕数'],
        rows: []
      },
      // 历史数据
      historyDataRows: [],
      historyWatchData: {
        columns: ['时间', '平均观看人数', '最大观看人数'],
        rows: []
      },
      historyGiftData: {
        columns: ['时间', '礼物数'],
        rows: []
      },
      historyBulletData: {
        columns: ['时间', '弹幕数'],
        rows: []
      },
      // 折线图设置
      watchChartSettings: {
        scale: [true, true],
        metrics: ['观看人数', '昨日平均观看人数', '昨日最大观看人数']
      },
      giftChartSettings: {
        scale: [true, true],
        metrics: ['礼物数', '昨日平均礼物数']
      },
      bulletChartSettings: {
        scale: [true, true],
        metrics: ['弹幕数', '昨日平均弹幕数']
      },
      // 实时排序
      branchWatchRank: [],
      branchGiftRank: [],
      branchBulletRank: [],
      // 历史排序
      branchHistoryWatchRank: [],
      branchHistoryGiftRank: [],
      branchHistoryBulletRank: [],

      getOnlineData: getTotalOnlineData,
      getHistoryData: getTotalHistoryData,
      getOnlineRank: getBranchRank,
      getHistoryRank: getBranchHistoryRank,


    }
  },
  methods: {
    // 更新实时折线图数据
    refreshOnline(parameters) {
      const onlineData = this.getOnlineData(parameters)
      this.onlineDataRows = []
      onlineData.then(res => {
        res.datas.forEach(item => {
          let displayTimeArray = item.time.split('  ')[1].split(':')
          this.onlineDataRows.push({
            '时间': displayTimeArray[0] + ':' + displayTimeArray[1],  // 横坐标展示效果: 15:23
            '观看人数': item.watchNum,
            '礼物数':item.gift,
            '弹幕数':item.bulletScreen,

            '昨日平均观看人数':2502347,
            '昨日平均礼物数':71056,
            '昨日平均弹幕数':2493410,
            '昨日最大观看人数':2545687
          })
          this.onlineWatchData.rows = this.onlineDataRows
          this.onlineGiftData.rows = this.onlineDataRows
          this.onlineBulletData.rows = this.onlineDataRows
        })
      })
    },

    // 更新历史折线图数据
    refreshHistory(parameters, dateBegin, dateEnd) {
      parameters.dateBeginStr = dateBegin
      parameters.dateEndStr2 = dateEnd
      this.historyDataRows = []
      this.getHistoryData(parameters).then(res => {
        if (res.datas.length===0){
          this.historyWatchData.rows = []
          this.historyGiftData.rows = []
          this.historyBulletData.rows = []
          this.noDataTitle={
            text: '暂无数据',
            left: "center",
            top: "center"
          }
          this.historyTitle = this.noDataTitle
        }else{
          this.noDataTitle = {}
          this.historyTitle = {text: '历史数据'}
          res.datas.forEach(item => {
            this.historyDataRows.push({
              '时间': item.date,
              '平均观看人数': item.watchNum,
              '礼物数': item.gift,
              '弹幕数': item.bulletScreen,
              '最大观看人数': item.maxWatchNum
            })
            this.historyWatchData.rows = this.historyDataRows
            this.historyGiftData.rows = this.historyDataRows
            this.historyBulletData.rows = this.historyDataRows
          })
        }
      })
    },

    // 更新实时排行
    refreshOnlineRank() {
      this.getOnlineRank().then(res => {
        this.branchWatchRank = []
        this.branchGiftRank = []
        this.branchBulletRank = []
        res.datas.forEach(item => {
          this.branchWatchRank.push({
            name: '分区' + item.branchId,
            total: item.watchNum
          })
          this.branchGiftRank.push({
            name: '分区' + item.branchId,
            total: item.gift
          })
          this.branchBulletRank.push({
            name: '分区' + item.branchId,
            total: item.bulletScreen
          })
        })
        this.branchWatchRank.sort(function (a, b) {
          return b.total - a.total
        })
        this.branchGiftRank.sort(function (a, b) {
          return b.total - a.total
        })
        this.branchBulletRank.sort(function (a, b) {
          return b.total - a.total
        })
      })
    },

    // 更新历史排行
    refreshHistoryRank(parameters, dateBegin, dateEnd) {
        parameters.dateBeginStr = dateBegin
        parameters.dateEndStr2 = dateEnd
      this.getHistoryRank(parameters).then(res => {
        this.branchHistoryWatchRank = []
        this.branchHistoryGiftRank = []
        this.branchHistoryBulletRank = []
        res.datas.forEach(item => {
          this.branchHistoryWatchRank.push({
            name: '分区' + item.branchId,
            total: item.watchNum
          })
          this.branchHistoryGiftRank.push({
            name: '分区' + item.branchId,
            total: item.gift
          })
          this.branchHistoryBulletRank.push({
            name: '分区' + item.branchId,
            total: item.bulletScreen
          })
        })
        this.branchHistoryWatchRank.sort(function (a, b) {
          return b.total - a.total
        })
        this.branchHistoryGiftRank.sort(function (a, b) {
          return b.total - a.total
        })
        this.branchHistoryBulletRank.sort(function (a, b) {
          return b.total - a.total
        })
      })
    },

    historyTimeChanged(time, timeStrList) {
      const beginStr = timeStrList[0]
      const endStr = timeStrList[1]
      console.log(beginStr, endStr)
      this.refreshHistory(this.parameters, beginStr, endStr)
      this.refreshHistoryRank(this.parameters,beginStr, endStr)
    },

    formatter (thistime, fmt) {
      let $this = new Date(thistime)
      let o = {
        'M+': $this.getMonth() + 1,
        'd+': $this.getDate(),
        'H+': $this.getHours(),
        'm+': $this.getMinutes(),
        's+': $this.getSeconds(),
        'q+': Math.floor(($this.getMonth() + 3) / 3),
        'S': $this.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },

    paramInit () {
      // todo changeMethods
      if (this.level === 'total'){
        this.parameters.totalId = this.levelId
        this.parameters.datetimeStr = this.formatter(new Date(),'yyyy-MM-dd HH:mm:ss')
      }
    },

    moment
  },
  created () {
    this.paramInit()
    this.refreshOnline(this.parameters)
    this.refreshHistory(this.parameters, '2019-5-20', '2020-5-20')
    this.refreshOnlineRank()
    this.refreshHistoryRank(this.parameters, '2019-5-20', '2020-5-20')
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
