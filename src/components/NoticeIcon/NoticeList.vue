<template>
  <div>
    <div v-if="data && data.length > 0">
      <a-list class="list">
        <a-list-item v-for="item in data" :class="'item '+ (item.read?'read':'')" :key="item.key || i" @click="() => onClick(item)">
          <a-list-item-meta class="meta">
            <template slot="title">
              <div class="title">
                {{ item.alarmId }}
                <div class="extra">
                  <a-tag v-if="item.extra" :color="getColor(item.extra)" style="margin-right: 0">{{ item.extra }}</a-tag>
                </div>
              </div>
            </template>
            <template slot="description">
              <div>
                <div class="description" :title="item.reason">
                  {{ item.reason }}
                </div>
                <div class="datetime">{{ formatter(item.startTime) }}</div>
              </div>
            </template>
            <template v-if="item.avatar" slot="avatar">
              <a-avatar class="avatar" :src="item.avatar" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <div class="clear" @click="onClear">
        {{ locale.clear }}
        {{ title }}
      </div>
    </div>
    <div v-else>
      <div class="notFound">
        <img v-if="emptyImage" :src="emptyImage" alt="not found" />
        <div v-if="emptyText">{{ emptyText }}</div>
        <div v-else-if="locale.emptyText">{{ locale.emptyText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeList',
  components: {},
  props: {
    locale: {
      type: Object
    },
    onClear: {
      type: Function
    },
    onClick: {
      type: Function
    },
    data: {
      type: Array
    },
    title: {
      type: String
    },
    emptyImage: {
      type: String
    },
    emptyText: {
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    getColor (isTimeout) {
      if(isTimeout==='待处理'){
        return '#63B8FF'
      }else{
        return 'red'
      }
    },
    formatter (datetime) {
      const date = datetime.split('T')[0]
      const time = datetime.split('T')[1].split(':')
      return date.split('-')[1] + '-' + date.split('-')[2] + ' ' + time[0] + ':' + time[1]
    }
  }
}
</script>

<style lang="less" scoped>
@import "./NoticeList.less";
</style>
