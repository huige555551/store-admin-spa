<template>
  <div>
  <!-- 面包屑 -->
    <el-form :inline="true">
      <el-form-item label="网站：">
        <span>活动管理</span>
      </el-form-item>
      <el-form-item label="菜单：">
        <span>活动列表</span>
      </el-form-item>
    </el-form>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="navigationName" label="分类" width="100"></el-table-column>
      <el-table-column label="视频" min-width="120">
        <template scope="scope">
          <p v-if="!scope.row.video">无</p>
          <a v-if="scope.row.video" :href="scope.row.video">{{scope.row.video}}</a>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.imgUrl" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="publicationDate" label="时间" width="160"></el-table-column>
      <el-table-column label="活动信息" width="120">
        <template scope="scope">
          <el-button type="default" @click.native.prevent="showActivityDetail(scope.$index)">查看活动</el-button>
        </template>
      </el-table-column>
      <el-table-column label="投票" width="120">
        <template scope="scope">
          <p v-if="!scope.row.hasVote">无</p>
          <el-button v-if="scope.row.hasVote" type="default" @click.native.prevent="showVoteDetail(scope.$index)">查看投票</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" size="small" @click.native.prevent="$router.push('/activity/edit/' + scope.row.id)">编辑</el-button>
          <el-button type="default" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 活动信息 -->
    <el-dialog title="活动信息" v-model="activityDialog">
      <el-tabs v-model="tabsName" @tab-click="handleClick">
        <el-tab-pane label="活动信息" name="first">
          <el-form label-width="100px">
            <el-form-item label="活动标题">
              <span>{{rowObj.title}}</span>
            </el-form-item>
            <el-form-item label="分类">
              <span>{{rowObj.navigationName}}</span>
            </el-form-item>
            <el-form-item label="视频链接">
              <a :href="rowObj.video">{{rowObj.video}}</a>
            </el-form-item>
            <el-form-item label="微博话题">
              <span>{{rowObj.weibo}}</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{rowObj.publicationDate}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="合作伙伴" name="second">
          <!-- Table -->
          <el-table :data="partners">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="name" label="名字"></el-table-column>
            <el-table-column label="跳转链接">
              <template scope="scope">
                <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
              </template>
            </el-table-column>
            <el-table-column label="LOGO">
              <template scope="scope">
                <img :src="scope.row.logo" width="200" max-height="200" @click="openImg(scope.row.logo)" style="cursor: pointer">
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 投票详情 -->
    <el-dialog title="投票详情" v-model="voteDialog">
      <el-tabs value="first">
        <el-tab-pane label="投票信息" name="first">
          <el-form label-width="100px">
            <el-form-item label="投票名称">
              <span>{{rowObj.name}}</span>
            </el-form-item>
            <el-form-item label="开始时间">
              <span>{{rowObj.startTime}}</span>
            </el-form-item>
            <el-form-item label="结束时间">
              <span>{{rowObj.endTime}}</span>
            </el-form-item>
            <el-form-item label="状态">
              <el-tag v-if="rowObj.status==='未开始'" type="gray">未开始</el-tag>
              <el-tag v-if="rowObj.status==='进行中'" type="success">进行中</el-tag>
              <el-tag v-if="rowObj.status==='已结束'" type="gray">已结束</el-tag>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="投票选项" name="second">
          <el-form label-width="100px">
            <el-form-item  v-for="(item,index) in rowObj.problems" :label="'问题' + (index+1)">
              <p>{{item.problem}}  <el-tag v-if="item.type==1" type="success">单选</el-tag>
                <el-tag v-if="item.type==2"type="success">多选</el-tag></p>
              <el-radio-group  v-if="item.type==1">
                <el-radio v-for="optionitem in item.options" :label="'选项' + (index+1)"></el-radio>
              </el-radio-group>
              <el-checkbox-group  v-if="item.type==2">
                <el-checkbox v-for="optionitem in item.options" :label="'选项' + (index+1)"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="结果统计" name="third">
          <el-form label-width="100px" style="width: 80%;">
            <el-form-item v-for="(item,index) in rowObj.result" :label="'问题' + (index+1)">
              <p>{{item.problem}} 
                <el-tag v-if="item.type==1"type="success">单选</el-tag>
                <el-tag v-if="item.type==2"type="success">多选</el-tag>
              </p>
              <div v-for="optionitem in item.option">
              <p>选项{{$index}}：{{optionitem.option}}</p>
              <el-progress :percentage="optionitem.votes"></el-progress>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

const _ = require('lodash')

export default {
  data() {
    return {
      activityDialog: false,
      voteDialog: false,
      partnerDialog: false,
      selectIndexId: null,
      // 分页
      total: 0,
      currentPage: 1,
      perPage: 10,
      // 表格
      tableData: [],
      partners: [],
      rowObj: {
        id: null,
        title: null,
        weibo: null,
        navigationId: null,
        video: null,
        introduction: null,
        coverKey: null,
        coverUrl: null
      },
      tabsName: 'first'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    },
    // 获取活动列表数据
    async fetchData() {
      this.tableData = []
      const { code, data } = await api.get('/api/system/activity/listActivity', {
        currentPage: this.currentPage,
        perPage: this.perPage
      })
      if (code === 200) {
        this.tableData = data.array
        this.total = data.total
      }
    },
    // 删除行
    deleteRow(index) {
      this.$confirm('此操作将该删除该活动，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const { code } = await api.post('/api/system/activity/deleteActivity', { id: this.tableData[index].id })
        if (code === 200) {
          this.tableData.splice(index, 1)
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.fetchData()
        }
      }).catch(() => {})
    },
    // 查看
    checkDetail(index) {
      this.rowObj = _.clone(this.tableData[index])
      this.articleDialog = true
    },
    // 查看投票
    async showVoteDetail(index) {
      this.rowObj = []
      const { code, data } = await api.get('/api/system/activity/getVote', { activityId: this.tableData[index].id })
      if (code === 200) {
        this.rowObj = data
        this.voteDialog = true
      }
    },
    // 查看活动
    async showActivityDetail(index) {
      this.rowObj = []
      this.selectIndexId = this.tableData[index].id
      this.tabsName = 'first'
      const { code, data } = await api.get('/api/system/activity/getActivity', { id: this.tableData[index].id })
      if (code === 200) {
        this.rowObj = data
        this.activityDialog = true
      }
    },
    async handleClick(tab) {
      if (tab.name === 'second') {
        const { code, data } = await api.get('/api/system/activity/listPartners', { activityId: this.selectIndexId })
        if (code === 200) {
          this.partners = data
        }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.perPage = val
      this.currentPage = 1
      this.fetchData()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>
