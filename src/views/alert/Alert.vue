<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="当前待处理" :content="alertOverView.to_do_counts" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本月已处理" :content="alertOverView.completed_alerts_this_month" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="平均处理时间" :content="alertOverView.avg_process_duration_this_month"/>
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="标准列表">

      <div slot="extra">
        <a-radio-group v-model="status">
          <a-radio-button value="waiting" @click="alertClassify(1)">待处理</a-radio-button>
          <a-radio-button value="done" @click="alertClassify(2)">已处理</a-radio-button>
          <a-radio-button value="timeout" @click="alertClassify(3)">已关闭</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <a-list
        size="large"
        :pagination="pagination">
        <a-list-item :key="index" v-for="(item, index) in alarms">
          <a-list-item-meta :description="item.alarm.reason">
            <a slot="title" @click="handleDetails(item.alarmId)">{{ item.alarmId }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleMark(item.alarmId, item.alarm.status)">{{ item.alarm.status===1 ? '标记' : '删除' }}</a>
          </div>
          <div slot="actions" v-if="item.alarm.status===1">
            <a @click="handleBanned(item.alarmId, item.alarm.status)">{{ '封禁' }}</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a>更多<a-icon type="down"/></a>
              <a-menu slot="overlay">
                <a-menu-item @click="handleDetails(item.alarmId)"><a>查看详情</a></a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="list-content" style="float: left">
            <div class="list-content-item" style="float: left">
              <span>处理人</span>
              <p>{{ item.alarm.finalDealName || '暂无' }}</p>
            </div>
            <div class="list-content-item" style="float: left">
              <span>开始时间</span>
              <p>{{ item.alarm.startTime.split('.')[0].replace('T', ' ') }}</p>
            </div>
            <div class="list-content-item" style="float: left">
              <span v-if="item.alarm.endTime">结束时间</span>
              <p>{{ item.alarm.endTime ? item.alarm.endTime.split('.')[0].replace('T', ' ') : (item.isTimeout ? '已超时' : '待处理') }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>

    <a-modal :visible="visible" @ok="handleOk" @cancel="handleOk" @close="handleOk">
      <a-steps
        direction="vertical"
        size="small"
      >
        <a-step :title="alertStep[0].title" :description="alertStep[0].description" :status="alertStep[0].status"/>
        <a-step :title="alertStep[1].title" :description="alertStep[1].description" :status="alertStep[1].status"/>
        <a-step :title="alertStep[2].title" :description="alertStep[2].description" :status="alertStep[2].status"/>
        <a-step :title="alertStep[3].title" :description="alertStep[3].description" :status="alertStep[3].status"/>
      </a-steps>
    </a-modal>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import {
  getAlertList,
  getAlertOverView,
  updateAlert,
  deleteAlert,
  banAnchor,
  getAlertTransfer
} from '../../api/LBMSmanage'
import store from '../../store'

const alertStep = [
  { title: '小组长', description: '', status: 'waiting' },
  { title: '大组长', description: '', status: 'waiting' },
  { title: '经理', description: '', status: 'waiting' },
  { title: '总经理', description: '', status: 'waiting' }
]

export default {
  name: 'StandardList',
  components: {
    HeadInfo
  },
  data () {
    return {
      pagination: {
        onChange: (page, size) => {
          this.pagination.current = page
          this.pagination.pageSize = size
          const parameters = {
            status: this.alertStatus,
            page_size: this.pagination.pageSize,
            page: this.pagination.current
          }
          getAlertList(parameters).then(res => {
            this.alarms = res.datas
            this.pagination.total = res.count
          })
        },
        showQuickJumper: true,
        pageSize: 5,
        total: 0,
        current: 1
      },
      alertStep,
      visible: false,
      alerts: [],
      alarms: [],
      alertOverView: {
        to_do_counts: '',
        completed_alerts_this_month: '',
        avg_process_duration_this_month: ''
      },
      status: 'waiting',
      alertStatus: 1
    }
  },
  created () {
    this.getOverView()
    const parameters = {
      status: 1,
      page_size: this.pagination.pageSize,
      page: this.pagination.current
    }
    getAlertList(parameters).then(res => {
      this.alarms = res.datas
      this.pagination.total = res.count
    })
  },
  methods: {
    alertClassify (value) {
      this.alertStatus = value
      const parameters = {
        status: this.alertStatus,
        page_size: this.pagination.pageSize,
        page: 1
      }
      getAlertList(parameters).then(res => {
        this.alarms = res.datas
        this.pagination.total = res.count
        // this.$store.commit('SET_ALERT_NUM', res.count)
      })
    },
    handleOk () {
      this.visible = false
    },
    handleDetails (alertId) {
      this.alertStep = [
        { title: '小组长', description: '', status: 'waiting' },
        { title: '大组长', description: '', status: 'waiting' },
        { title: '经理', description: '', status: 'waiting' },
        { title: '总经理', description: '', status: 'waiting' }
      ]
      this.visible = true
      getAlertTransfer({ alarmId: alertId }).then(res => {
        const alertTransfer = res.data
        if (alertTransfer.status === 1) { // 待处理
          for (let i = 0; i < alertTransfer.anchorAlarmTransWay.length; i++) {
            this.alertStep[i].title = this.getLevelName(alertTransfer.anchorAlarmTransWay[i].role) + ' : ' + alertTransfer.anchorAlarmTransWay[i].username
            this.alertStep[i].description = alertTransfer.anchorAlarmTransWay[i].time.split('.')[0].replace('T', ' ')
            this.alertStep[i].status = 'process'
          }
        } else if (alertTransfer.status === 2) { // 已处理
          for (let i = 0; i < alertTransfer.anchorAlarmTransWay.length; i++) {
            this.alertStep[i].title = this.getLevelName(alertTransfer.anchorAlarmTransWay[i].role) + ' : ' + alertTransfer.anchorAlarmTransWay[i].username
            this.alertStep[i].description = alertTransfer.anchorAlarmTransWay[i].time.split('.')[0].replace('T', ' ')
            this.alertStep[i].status = 'process'
          }
          // magic number: 4
          // 如果处理层级为3 即大组长处理 则按alertStep的顺序将第2项（索引为1）的status置为finish
          // 其他情况依此类推 index = 4 - finalDealLevel
          this.alertStep[4 - alertTransfer.finalDealLevel].status = 'finish'
        }
      })
    },
    handleMark (alertId, status) {
      if (status === 1) {
        const parameters = { alarmId: alertId, operation: 2 }
        updateAlert(parameters).then(res => {
          this.getOverView()
          this.alertClassify(status)
          this.$store.commit('SET_ALARM_NUM', store.getters.alarmNum - 1)
          this.$message.success('警报处理成功!')
        }).catch(err => {
          this.$message.error(err)
        })
      } else {
        deleteAlert( {alarmId: alertId} ).then(res => {
          this.alertClassify(status)
          this.$store.commit('SET_ALARM_NUM', store.getters.alarmNum - 1)
          this.$message.success('警报删除成功!')
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },

    handleBanned (alertId, status) {
      if (status === 1) {
        const parameters = { alarmId: alertId, operation: 2 }
        banAnchor({ alarmId: alertId })
        updateAlert(parameters).then(res => {
          this.getOverView()
          this.alertClassify(status)
          this.$store.commit('SET_ALARM_NUM', store.getters.alarmNum - 1)
          this.$message.success('主播封禁成功!')
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },

    getOverView () {
      getAlertOverView().then(res => {
        res = res.data
        this.alertOverView.to_do_counts = res.waitingNum + '条警报'
        this.alertOverView.completed_alerts_this_month = res.doneNum + '条警报'
        this.alertOverView.avg_process_duration_this_month = res.avgDealCost === '0' ? '暂无' : Math.floor(res.avgDealCost / 60) + '分' + res.avgDealCost%60 + '秒'
      })
    },

    getLevelName (role) {
      if(role===4){return '小组长'}
      if(role===3){return '大组长'}
      if(role===2){return '经理'}
      if(role===1){return '总经理'}
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
  }

  .list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 55px;
    min-width: 70px;
    span {
      line-height: 20px;
    }
    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
  }

  .list-content {
    width: 500px;
  }
</style>
