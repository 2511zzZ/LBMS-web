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
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
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
import { getBranchList } from '../../api/LBMSmanage'

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

      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,

      getList: getBranchList
    }
  },
  methods: {

    columnsInit () {
      if( this.level==='total' ){
        this.columns = [
          {
            title: '#',
            scopedSlots: { customRender: 'serial' }
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
    },
    loadDataInit () {
      if( this.level==='total' ){
        this.getList = getBranchList
      }
      this.loadData = () => {
        const parameters = { page:1, pageSize:30 }
        return this.getList(parameters)
          .then(res => {
            res.pageNo = parameters.page
            res.pageSize = parameters.pageSize
            res.totalCount = res.count
            res.totalPage = Math.floor(res.count, res.pageSize)
            res.data = res.datas
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

    handleClick (record) { console.log(record) },

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
