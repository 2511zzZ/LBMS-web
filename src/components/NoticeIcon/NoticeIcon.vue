<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane :tab="dataList.list && dataList.list.length > 0 ? `${dataList.title} (${dataList.list.length})` : dataList.title" >
            <NoticeList
              :data="dataList.list"
              :onClick="handleClick"
              :onClear="() => onClear(dataList.title)"
              :title="dataList.title"
              :locale="locale"
              :emptyImage="dataList.emptyImage"
              :emptyText="dataList.emptyText"
            />
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="alarmNum">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import NoticeList from './NoticeList'
import { getAlertList } from '../../api/LBMSmanage'
import store from '../../store'

export default {
  name: 'HeaderNotice',
  components: {
    NoticeList
  },
  props: {
    popupAlign: {
      type: Object
    },
    count: {
      type: Number
    },
    onClear: {
      type: Function
    },
    onItemClick: {
      type: Function
    },
    className: {
      type: String
    },
    onPopupVisibleChange: {
      type: Function
    },
    notices: {
      type: Array
    }
  },
  data () {
    return {
      websock: null,
      alarmNum: 0,
      dataList:
        {
          list: [],
          title: '警报',
          emptyText: '您已处理完所有警报',
          emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
        },
      tabType: '',
      locale: {
        emptyText: '暂无数据',
        clear: '清空'
      },
      // eslint-disable-next-line vue/no-dupe-keys
      loading: false,
      visible: false
    }
  },
  watch: {
    '$store.state.user.alarmNum': function () {
      // this.alarmNum = this.$store.state.user.alarmNum
      // this.alarmNum = store.getters.alarmNum
      //
      getAlertList({ status: 1 }).then(res => {
        this.$store.commit('SET_ALARM_NUM', res.datas.length)
        this.alarmNum = store.getters.alarmNum
        const alarmList = res.datas
        this.dataList.list = []
        for(let i = 0;i < alarmList.length; i++){
          this.dataList.list.push({
            alarmId: alarmList[i].alarm.alarmId,
            reason: alarmList[i].alarm.reason,
            extra: alarmList[i].isTimeout === 0 ? '待处理': '已超时',
            status: alarmList[i].alarm.status,
            key: alarmList[i].alarm.alarmId,
            startTime: alarmList[i].alarm.startTime
          })
        }
      })
    }
  },
  methods: {
    fetchNotice () {
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    },
    handleClick () {
      this.$router.replace('/alarm/')
      this.visible = false
    },
    initWebSocket () {
      const wsurl = 'ws://127.0.0.1:8080/imserver/' + store.getters.employeeId
      this.websock = new WebSocket(wsurl)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      console.log('已连接')
    },
    websocketonerror (err) { // 连接建立失败重连
      // this.initWebSocket()
      console.log('err', err)
    },
    websocketonmessage (e) { // 数据接收
      getAlertList({ status: 1 }).then(res => {
        this.$store.commit('SET_ALARM_NUM', res.datas.length)
        const alarmList = res.datas
        this.dataList.list = []
        for(let i = 0;i < alarmList.length; i++){
          this.dataList.list.push({
            alarmId: alarmList[i].alarm.alarmId,
            reason: alarmList[i].alarm.reason,
            extra: alarmList[i].isTimeout === 0 ? '待处理': '已超时',
            status: alarmList[i].alarm.status,
            key: alarmList[i].alarm.alarmId,
            startTime: alarmList[i].alarm.startTime
          })
        }
      })
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    }
  },
  created () {
    this.initWebSocket()
    this.alarmNum = store.getters.alarmNum
    getAlertList({ status: 1 }).then(res => {
      this.$store.commit('SET_ALARM_NUM', res.datas.length)
      const alarmList = res.datas
      this.dataList.list = []
      for(let i = 0;i < alarmList.length; i++){
        this.dataList.list.push({
          alarmId: alarmList[i].alarm.alarmId,
          reason: alarmList[i].alarm.reason,
          extra: alarmList[i].isTimeout,
          status: alarmList[i].alarm.status,
          key: alarmList[i].alarm.alarmId,
          startTime: alarmList[i].alarm.startTime
        })
      }
    })
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  }
}
</script>

<style lang="css">
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
