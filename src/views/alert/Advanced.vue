<template>
  <div className="test">

  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      websock: null
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket () { // 初始化weosocket
      const wsuri = 'ws://127.0.0.1:8001/ws/alert/'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      console.log('已连接')
      // const actions = { 'cur_req': { 'type': 'group', 'id': 100, 'metric': 'accuracy' } }
      // this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror (err) { // 连接建立失败重连
      // this.initWebSocket()
      console.log('err', err)
    },
    websocketonmessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      console.log(redata)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    }
  }
}
</script>
<style lang='less'>

</style>
