<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="category" label="分类" width="100"></el-table-column>
      <el-table-column label="视频" min-width="120">
        <template scope="scope">
          <p v-if="!scope.row.video">无</p>
          <a v-if="scope.row.video" :href="scope.row.video">{{scope.row.video}}</a>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="200">
        <template scope="scope">
          <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间" width="140"></el-table-column>
      <el-table-column label="活动信息" width="120">
        <template scope="scope">
          <el-button type="default" @click.native.prevent="activityDialog = true">查看活动</el-button>
        </template>
      </el-table-column>
      <el-table-column label="投票" width="120">
        <template scope="scope">
          <p v-if="!scope.row.vote">无</p>
          <el-button v-if="scope.row.vote" type="default" @click.native.prevent="voteDialog = true">查看投票</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="weiboTag" label="微博话题" min-width="120"></el-table-column>
      <el-table-column label="评论管理" width="120">
        <template scope="scope">
          <el-button type="default" size="small">评论管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="default" size="small">编辑</el-button>
          <el-button type="default" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
    </div>

    <!-- 活动信息 -->
    <el-dialog title="活动信息" v-model="activityDialog">
      <el-tabs value="first">
        <el-tab-pane label="活动信息" name="first">
          <el-form label-width="100px">
            <el-form-item label="活动标题">
              <span>活动标题</span>
            </el-form-item>
            <el-form-item label="分类">
              <span>这是分类</span>
            </el-form-item>
            <el-form-item label="视频链接">
              <a href="http://baidu.com">http://baidu.com</a>
            </el-form-item>
            <el-form-item label="微博话题">
              <span>#新周刊</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>2017-03-03</span>
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
                <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
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
              <span>投票名称</span>
            </el-form-item>
            <el-form-item label="开始时间">
              <span>2016-03-03</span>
            </el-form-item>
            <el-form-item label="结束时间">
              <span>2016-03-03</span>
            </el-form-item>
            <el-form-item label="状态">
              <el-tag type="gray">未开始</el-tag>
              <el-tag type="success">进行中</el-tag>
              <el-tag type="gray">已结束</el-tag>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="投票选项" name="second">
          <el-form label-width="100px">
            <el-form-item label="问题一">
              <p>问题描述 <el-tag type="success">单选</el-tag></p>
              <el-radio-group>
                <el-radio label="选项一"></el-radio>
                <el-radio label="选项二"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="问题二">
              <p>问题描述 <el-tag type="success">多选</el-tag></p>
              <el-checkbox-group>
                <el-checkbox label="选项一"></el-checkbox>
                <el-checkbox label="选项二"></el-checkbox>
                <el-checkbox label="选项三"></el-checkbox>
                <el-checkbox label="选项四"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="结果统计" name="third">
          <el-form label-width="100px" style="width: 80%;">
            <el-form-item label="问题一">
              <p>问题描述 <el-tag type="success">单选</el-tag></p>
              <p>选项一：XXXXX</p>
              <el-progress :percentage="20"></el-progress>
              <p>选项二：XXXXX</p>
              <el-progress :percentage="20"></el-progress>
            </el-form-item>
            <el-form-item label="问题二">
              <p>问题描述 <el-tag type="success">单选</el-tag></p>
              <p>选项一：XXXXX</p>
              <el-progress :percentage="20"></el-progress>
              <p>选项二：XXXXX</p>
              <el-progress :percentage="20"></el-progress>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityDialog: false,
      voteDialog: false,
      partnerDialog: false,
      currentPage: 1,
      searchKey: {},
      tableData: [
        { title: '这是标题1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '分类', description: '简介', voteTitle: '投票标题', createdAt: '2017-02-02 12:30', weiboTag: '#新周刊', partner: [], vote: null, video: 'http://baidu.com' },
        { title: '这是标题2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '分类', description: '简介', voteTitle: '投票标题', createdAt: '2017-02-02 12:30', weiboTag: '#新周刊', partner: [], vote: null, video: 'http://baidu.com' },
        { title: '这是标题3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '分类', description: '简介', voteTitle: '投票标题', createdAt: '2017-02-02 12:30', weiboTag: '#新周刊', partner: [], vote: null, video: '' },
        { title: '这是标题4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '分类', description: '简介', voteTitle: '投票标题', createdAt: '2017-02-02 12:30', weiboTag: '#新周刊', partner: [], vote: { title: '这是标题1', description: '这是描述', startTime: '2016-03-01', endTime: '2016-03-03', questions: [{ name: '问题', answer: ['选项1', '选项2', '选项3'] }, { name: '问题', answer: ['选项1', '选项2', '选项3'] }] }, video: '' },
        { title: '这是标题5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '分类', description: '简介', voteTitle: '投票标题', createdAt: '2017-02-02 12:30', weiboTag: '#新周刊', partner: [], vote: null, video: 'http://baidu.com' },
        { title: '这是标题6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', category: '分类', description: '简介', voteTitle: '投票标题', createdAt: '2017-02-02 12:30', weiboTag: '#新周刊', partner: [], vote: null, video: 'http://baidu.com' }
      ],
      partners: [
        { name: '合作伙伴1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' }
      ]
    }
  },
  methods: {
    // 新窗口打开轮播图
    openImg(url) {
      window.open(url)
    }
  }
}
</script>
