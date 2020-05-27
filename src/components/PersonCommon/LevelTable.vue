<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleClick(record)">查看</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, TopCards, MonitorCharts } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import "echarts/lib/component/title"
import { getBranchList, getGroupList, getTeamList, getAnchorList } from '../../api/LBMSmanage'

export default {
  name: 'LevelTable',
  mixins: [mixinDevice],
  components: {
    STable,
    TopCards,
    MonitorCharts
  },
  props: {
    level: { type: String, required: true },
    levelId: { type: Number, required: true }
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},

      // 搜索列表
      columns: [],
      loadData: () => {},

      // 一秒加载动画
      loading: true,

      getList: getBranchList
    }
  },
  methods: {

    columnsInit () {
      if( this.level==='branch' ){
        this.columns = [
          {
            title: '分区号',
            dataIndex: 'branchId'
          },
          {
            title: '分区名',
            dataIndex: 'branchName'
          },
          {
            title: '管理用户编号',
            dataIndex: 'employeeId'
          },
          {
            title: '管理用户名',
            dataIndex: 'employeeName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ]
      }
      if( this.level==='group' ){
        this.columns = [
          {
            title: '大组号',
            dataIndex: 'groupId'
          },
          {
            title: '大组名',
            dataIndex: 'groupName'
          },
          {
            title: '管理用户编号',
            dataIndex: 'employeeId'
          },
          {
            title: '管理用户名',
            dataIndex: 'employeeName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ]
      }
      if( this.level==='team' ){
        this.columns = [
          {
            title: '小组号',
            dataIndex: 'teamId'
          },
          {
            title: '小组名',
            dataIndex: 'teamName'
          },
          {
            title: '管理用户编号',
            dataIndex: 'employeeId'
          },
          {
            title: '管理用户名',
            dataIndex: 'employeeName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ]
      }
      if( this.level==='anchor' ){
        this.columns = [
          {
            title: '主播编号',
            dataIndex: 'anchorId'
          },
          {
            title: '房间号',
            dataIndex: 'roomId'
          },
          {
            title: '主播姓名',
            dataIndex: 'name'
          },
          {
            title: '主播昵称',
            dataIndex: 'nickname'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ]
      }
    },
    loadDataInit () {
      if( this.level==='branch' ){
        this.getList = getBranchList
      }
      if( this.level==='group' ){
        this.getList = getGroupList
      }
      if( this.level==='team' ){
        this.getList = getTeamList
      }
      if( this.level==='anchor' ){
        this.getList = getAnchorList
      }
      this.loadData = (parameters) => {
        parameters.page = parameters.pageNo
        console.dir(parameters)
        return this.getList(parameters)
          .then(res => {
            res.pageNo = parameters.page
            res.pageSize = parameters.pageSize
            res.totalCount = res.count
            res.totalPage = Math.floor(res.count, res.pageSize)
            res.data = res.datas
            // const nameList = ['李海','黄宇翔','王嘉豪','王乔','李先一','张家源','陈靖仇','马硕','陈张宇','何木灵']
            // for(let i=0;i<res.data.length;i++){
            //   res.data[i].employeeName = nameList[i]
            // }
            delete res.count
            delete res.datas
            return res
          })
      }
    },

    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
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

    handleClick (record) {
      this.$emit('onClick', record[Object.keys(record)[0]])
    },

    moment
  },
  created () {
    this.tableOption()
    this.columnsInit()
    this.loadDataInit()
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
