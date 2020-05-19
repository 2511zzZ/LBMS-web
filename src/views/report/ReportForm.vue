<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="报表类型"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
          'type',
          { rules: [{ required: true, message: '请选择报表类型!' }] },
        ]"
          >
            <a-select-option value="alert" v-if="isDpt">
              警报
            </a-select-option>
            <a-select-option value="dpt" v-if="isDpt">
              生产部
            </a-select-option>
            <a-select-option value="workshop" v-if="isWorkshop">
              车间
            </a-select-option>
            <a-select-option value="group" v-if="isGroup">
              大组
            </a-select-option>
            <a-select-option value="team">
              小组
            </a-select-option>
            <a-select-option value="stat">
              工位
            </a-select-option>
            <a-select-option value="worker">
              工人
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="报表对象"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <div>
            <!--          <div :style="{ borderBottom: '1px solid #E9E9E9' }">-->
            <a-checkbox
              :indeterminate="indeterminate"
              disabled
              @change="onCheckAllChange"
              :checked="checkAll"
              v-decorator="['all_id']"
            >
              全选
            </a-checkbox>
            <!--          </div>-->
            <!--          <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />-->
          </div>
        </a-form-item>
        <a-form-item
          label="统计月份"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          help="暂时只支持导出上月报表"
        >
          <a-month-picker
            :defaultValue="moment(yearNow+'/'+monthNow, monthFormat)"
            :format="monthFormat"
            disabled
            v-decorator="[
            'buildMonth',
            {rules: [{ required: false, message: '请选择统计月份' }]}]"
          />
        </a-form-item>
        <a-form-item
          hidden
          label="起止日期"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-range-picker
            name="buildTime"
            style="width: 100%"
            disabled
            v-decorator="[
            'buildTime',
            {rules: [{ required: false, message: '请选择起止日期' }]}
          ]" />
        </a-form-item>
        <a-form-item
          label="报表格式"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="true"
        >
          <a-radio-group
            v-model="value"
            v-decorator="['FileType']"
          >
            <a-radio :value="1">excel</a-radio>
            <a-radio :value="2">pdf</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="value===2"
          label="报表密码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-input-password v-decorator="['password']" placeholder="不输入则默认无密码" />
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-modal
      title="报表下载"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="spinning"/>
      <a v-if="fileLink" :href="fileLink" target="_blank" @click="handleDownload" id='downloadLink'>{{ fileDone }}</a>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'

const plainOptions = ['工位1', '工位2', '工位3', '...']
const defaultCheckedList = ['工位1', '工位3']
const date = new Date()
export default {
  name: 'ReportForm',
  data () {
    return {
      level: this.$store.state.user.level,
      isDpt: this.$store.state.user.level === 'dpt',
      isWorkshop: this.$store.state.user.level === 'workshop' | this.$store.state.user.level === 'dpt',
      isGroup: this.$store.state.user.level === 'workshop' | this.$store.state.user.level === 'dpt' | this.$store.state.user.level === 'group',
      spinning: false,
      fileLink: null,
      fileDone: '',
      yearNow: date.getFullYear(),
      monthNow: date.getMonth(),
      visible: false,
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      monthFormat: 'YYYY/MM',
      plainOptions,
      value: 1,
      // form
      form: this.$form.createForm(this)
    }
  },
  methods: {
    moment,
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          this.visible = true
          this.spinning = true
          getReportFile(values).then(res => {
            this.spinning = false
            this.fileDone = '报表已生成, 点击下载或查看'
            this.fileLink = res.result.url
          })
        }
      })
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleCancel (e) {
      this.visible = false
    },
    handleDownload () {
      this.fileDone = ''
      this.visible = false
    },
    handleOk () {
      document.getElementById('downloadLink').click()
      this.fileDone = ''
      this.visible = false
    }
  }
}
</script>
