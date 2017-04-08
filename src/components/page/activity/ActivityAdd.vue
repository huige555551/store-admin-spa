<template>
  <div>
    <!-- 创建活动 -->
    <el-tabs value="first" @tab-click="handleClick">

      <!-- 活动信息 -->
      <el-tab-pane label="活动信息" name="first">
        <div class="form-box">
          <el-form ref="form" :model="activity" label-width="100px" style="width: 500px;">
            <el-form-item label="封面上传">
                <UploadSingle
                  :imgUrl="activity.imgUrl"
                  :imgKey="activity.imgKey"
                  :size=1 dimension="240x240"
                  @handleRemove="handleRemove"
                  @handleSuccess="handleSuccess">
                </UploadSingle>
                <div slot="tip" class="el-upload__tip">建议尺寸 1440x320，只能上传jpg/png文件，且不超过1MB</div>
            </el-form-item>
            <el-form-item label="活动标题">
              <el-input v-model="activity.title"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="activity.vote.startTime"
                type="date"
                @change="changeDate"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="activity.vote.endTime"
                type="date"
                @change="changeEndDate"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="微博话题">
              <el-input v-model="activity.weibo"></el-input>
            </el-form-item>
            <el-form-item label="选择分类">
              <el-select v-model="activity.navigationId" filterable remote
                placeholder="请输入栏目进行搜索">
                  <el-option
                  v-for="item in columnResults"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="视频连接(可选)">
              <el-input v-model="activity.video"></el-input>
            </el-form-item>
            <el-form-item label="活动简介">
              <el-input type="textarea" :rows="4" v-model="activity.introduction"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">提交</el-button>
              <el-button @click="$router.push('/activity/list')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

      <!-- 投票信息 -->
      <!-- <el-tab-pane label="投票信息" name="second"> -->
        <div class="form-box">
          <el-form ref="form" :model="activity" label-width="100px">
            <el-form-item label="启用投票">
              <el-switch v-model="activity.hasVote" change="changeSwitch" on-color="#13ce66" off-color="#ff4949"></el-switch>
            </el-form-item>
            <div v-for="(item,index) in activity.vote.problems">
              <el-form-item label="问题一">
                <p>{{ item.problem }}
                <el-tag type="success" v-if="item.ifSingle">单选</el-tag>
                <el-tag type="success" v-if="!item.ifSingle">多选</el-tag>
                <el-button type="default" style="margin-left: 10px" @click="editQuestion(index)">编辑</el-button></p>
                <el-radio-group v-model="item.ifSingle">
                  <el-radio :disabled="true" :label="true">单选</el-radio>
                  <el-radio :disabled="true" :label="false">多选</el-radio>
                </el-radio-group>
                <el-radio-group v-for="option in item.options" style="display:block;">
                  <el-radio :disabled="true" :label="option.option" style="margin-top:15px">{{ option.option }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="default" @click.native.prevent="questionDialog = true">添加问题</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

        <!-- 添加问题 -->
        <el-dialog title="添加问题" v-model="questionDialog">
          <el-form label-width="100px" class="demo-dynamic">
            <el-form-item label="问题">
              <el-input v-model="newQuestion.problem"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="newQuestion.ifSingle">
                <el-radio :label="true">单选</el-radio>
                <el-radio :label="false">多选</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-for="(option, index) in newQuestion.options" :label="'选项' + (index+1)" :key="option.key">
              <el-input v-model="option.option"></el-input>
              <el-button style="margin-left: 20px" @click="deleteOption(index)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="addOption">新增选项</el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addQuestion">确 定</el-button>
            <el-button @click="questionDialog = false">取 消</el-button>
          </div>
        </el-dialog>     
      </el-tab-pane>

      <!-- 合作伙伴 -->
      <el-tab-pane label="合作伙伴" name="third" v-if="editing" >
        <!-- Table -->
        <el-table :data="tableData">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="name" label="名字" min-width="120"></el-table-column>
          <el-table-column label="跳转链接" min-width="120">
            <template scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column label="LOGO" width="200">
            <template scope="scope">
              <img :src="scope.row.logo" width="200" max-height="200" @click="openImg(scope.row.logo)" style="cursor: pointer">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template scope="scope">
              <el-button type="default" size="small" @click="editPartner(scope.$index)">编辑</el-button>
              <el-button type="default" size="small" @click="deletePartner(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加按钮 -->
        <el-form style="margin-top: 20px">
          <el-form-item>
            <el-button @click="addPartner">添加合作伙伴</el-button>
          </el-form-item>
        </el-form>

        <!-- 添加合作伙伴 -->
        <el-dialog title="添加合作伙伴" v-model="partnerDialog" label-position="right">
          <el-form :model="newPartner" label-width="100px">
            <el-form-item label="名字">
              <el-input v-model="newPartner.name"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="newPartner.url"></el-input>
            </el-form-item>
            <el-form-item label="LOGO">
              <UploadSingle
                :imgUrl="newPartner.logo"
                :imgKey="newPartner.imgKey"
                :size=1 dimension="240x240"
                @handleRemove="handlePartnerRemove"
                @handleSuccess="handlePartnerSuccess">
              </UploadSingle>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native.prevent="partnerDialog=false">取 消</el-button>
            <el-button type="primary" @click.native.prevent="saveRow">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/api'
import UploadSingle from '@/components/util/UploadSingle'

const _ = require('lodash')

export default {
  data() {
    return {
      dateStr: null,
      milliSeconds: null,
      activeName: 'first',
      editing: false,
      newPartner: {},
      newQuestion: {
        ifSingle: null,
        options: []
      },
      editingPartner: false,
      questionDialog: false,
      partnerDialog: false,
      searchKey: '',
      vote: {},
      activity: {
        hasVote: false,
        imgUrl: null,
        imgKey: null,
        navigationId: null,
        title: null,
        navigationName: null,
        weibo: null,
        startTime: null,
        endTime: null,
        vote: {
          startTime: null,
          endTime: null,
          problems: []
        }
      },
      tableData: [
        // { name: '合作伙伴1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        // { name: '合作伙伴2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        // { name: '合作伙伴3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        // { name: '合作伙伴4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        // { name: '合作伙伴5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        // { name: '合作伙伴6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' }
      ],
      columnResults: []
    }
  },
  async created() {
    // 拿回所有栏目
    this.fetchData()
    const { code, data } = await api.get('/api/system/activity/listNavigation')
    if (code === 200) {
      this.columnResults = data
    }
  },
  components: {
    UploadSingle
  },
  watch: {
    /* eslint-disable */
    '$route'() {
      this.fetchData()
    /* eslint-enable */
    }
  },
  methods: {
    openImg(url) {
      window.open(url)
    },
    async fetchData() {
      if (this.$route.params.id) {
        this.editing = true
        const { code, data } = await api.get('/api/system/activity/getActivity', { id: this.$route.params.id })
        // console.log(data)
        if (code === 200) {
          this.activity = data
          console.log(this.activity)
          // this.actiity.vote = data.vote
        }
      } else {
        this.editing = false
      }
    },
    // 点击tab标签
    async handleClick(tab) {
      if (tab.name === 'third') {
        const { code, data } = await api.get('/api/system/activity/listPartners', { activityId: this.activity.id })
        if (code === 200) {
          console.log(data)
          this.tableData = data
        }
      }
    },
    // 添加活动
    // 删除活动封面图片
    handleRemove() {
      this.activity.imgKey = null
      this.activity.imgUrl = null
    },
    // 活动封面图片上传成功
    handleSuccess(response, bucketPort) {
      this.$set(this.activity, 'imgUrl', `${bucketPort}/${response.key}`)
      this.$set(this.activity, 'imgKey', response.key)
    },
    async save() {
      console.log(this.activity.vote)
      if (typeof this.activity.vote === 'object') {
        this.activity.vote = JSON.stringify(this.activity.vote)
      }
      if (!this.activity.imgUrl || !this.activity.navigationId || !this.activity.weibo || !this.activity.introduction) {
        return this.$notify.error({ title: '错误', message: '表单信息不完整' })
      }
      if (this.editing) {
        const { code } = await api.post('/api/system/activity/updateActivity', this.activity)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/activity/list')
        }
      } else {
        const { code } = await api.post('/api/system/activity/addActivity', this.activity)
        if (code === 200) {
          this.$notify.success({ title: '成功', message: '保存成功' })
          this.$router.push('/activity/list')
        }
      }
      // this.activity.vote = []
    },
    // 编辑问题
    editQuestion(index) {
      this.editing = true
      this.editingIndex = index
      this.questionDialog = true
      this.newQuestion = _.clone(this.activity.vote.problems[index])
      console.log(this.newQuestion)
    },
    // 添加问题
    addQuestion() {
      if (this.newQuestion.ifSingle === null || !this.newQuestion.problem || this.newQuestion.options.length === 0) {
        console.log(this.newQuestion)
        return this.$notify.error({ title: '添加失败', message: '表单信息不完整' })
      }
      if (this.editing === true) {
        this.activity.vote.problems.splice(this.editingIndex, 1, _.cloneDeep(this.newQuestion))
      } else {
        this.activity.vote.problems.push(_.cloneDeep(this.newQuestion))
        console.log(this.activity)
      }
      this.questionDialog = false
      this.newQuestion = { ifSingle: null, options: [], problem: null }
      this.editing = false
    },
    addOption() {
      if (this.newQuestion.options.length === 4) {
        return this.$notify.error({ title: '错误', message: '选项数目已达到四个' })
      }
      this.newQuestion.options.push({ id: null, value: null, label: null })
    },
    deleteOption(index) {
      this.newQuestion.options.splice(index, 1)
    },
    // 时间格式
    changeDate(val) {
      console.log(val)
      // this.dateStr = val.replace(/-/g, '/')
      // this.milliSeconds = Date.parse(this.dateStr) / 1000
      // console.log(this.milliSeconds)
      this.activity.vote.startTime = val
    },
    changeEndDate(val) {
      console.log(val)
      this.activity.vote.endTime = val
    },
    // 投票开关
    changeSwitch() {
      console.log(this.activity.hasVote)
      this.activity.hasVote = !this.activity.hasVote
    },
    // 添加合作伙伴
    addPartner() {
      // this.editing = false
      // this.newPartner.id = null
      // this.newPartner.name = null
      // this.newPartner.logo = null
      // this.newPartner.url = null
      this.partnerDialog = true
    },
    // 编辑合作伙伴
    editPartner(index) {
      this.editingPartner = true
      this.editingIndex = index
      this.newPartner.id = this.tableData[index].id
      this.newPartner.logo = this.tableData[index].logo
      this.newPartner.url = this.tableData[index].url
      this.newPartner.name = this.tableData[index].name
      this.partnerDialog = true
    },
    // 删除行
    async deletePartner(index) {
      this.$confirm('此操作将该删除该合作伙伴，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/activity/deletePartner', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 删除伙伴LOGO
    handlePartnerRemove() {
      this.$set(this.newPartner, 'imgKey', null)
      this.$set(this.newPartner, 'logo', null)
    },
    // 合作伙伴Logo上传成功
    handlePartnerSuccess(response, bucketPort) {
      this.$set(this.newPartner, 'logo', `${bucketPort}/${response.key}`)
      this.$set(this.newPartner, 'imgKey', response.key)
    },
    // 保存修改
    async saveRow() {
      console.log(this.newPartner)
      if (!this.newPartner.url || !this.newPartner.name || !this.newPartner.logo) {
        return this.$notify.error({ title: '失败', message: '表单信息不完整' })
      }
      if (this.editingPartner) {
        const { code } = await api.post('/api/system/activity/updatePartner', this.newPartner)
        if (code === 200) {
          this.tableData.splice(this.editingIndex, 1, _.clone(this.newPartner))
          this.$notify.success({ title: '成功', message: '修改成功' })
          this.partnerDialog = false
        }
      } else {
        console.log('addPartner')
        this.$set(this.newPartner, 'activityId', this.activity.id)
        this.$set(this.newPartner, 'logoKey', this.newPartner.logo)
        const { code } = await api.post('/api/system/activity/addPartner', this.newPartner)
        if (code === 200) {
          this.partnerDialog = false
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.$router.push('/activity/list')
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // TODO 突然离开未保存，提示管理员
    console.log('leave')
    next()
  }
}
</script>
