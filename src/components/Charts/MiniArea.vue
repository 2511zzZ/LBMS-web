<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="watchNum" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import { getTotalOnlineData, getBranchOnlineData, getGroupOnlineData, getTeamOnlineData } from '../../api/LBMSmanage'

export default {
  name: 'MiniArea',
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
      watchNum: [],
      height: 100,
      getOnlineData: () => {}
    }
  },
  methods: {
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
    }
  },
  created () {
    const datetimeStr = this.formatter(this.date,'yyyy-MM-dd HH:mm:ss')
    const parameters = {}
    if (this.level === 'total'){
      parameters.totalId = this.levelId
      this.getOnlineData = getTotalOnlineData
    }
    if (this.level === 'branch'){
      parameters.branchId = this.levelId
      this.getOnlineData = getBranchOnlineData
    }
    if (this.level === 'group'){
      parameters.groupId = this.levelId
      this.getOnlineData = getGroupOnlineData
    }
    if (this.level === 'team'){
      parameters.teamId = this.levelId
      this.getOnlineData = getTeamOnlineData
    }
    parameters.datetimeStr = datetimeStr
    this.getOnlineData(parameters).then(
      res => {
        res.datas.forEach(item => {
          let displayTimeArray = item.time.split('  ')[1].split(':')
          this.watchNum.push({
            x: displayTimeArray[0] + ':' + displayTimeArray[1],
            y: item.watchNum
          })
        })
      }
    )
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
