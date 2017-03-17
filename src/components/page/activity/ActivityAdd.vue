<template>
  <div>
    <!-- 创建活动 -->
    <el-tabs value="first">

      <!-- 活动信息 -->
      <el-tab-pane label="活动信息" name="first">
        <div class="form-box">
          <el-form ref="form" :model="activity" label-width="100px" style="width: 500px;">
            <el-form-item label="封面上传">
              <el-upload action="" :file-list="activity.cover">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">建议尺寸 1440x320，只能上传jpg/png文件，且不超过1MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="活动标题">
              <el-input v-model="activity.title"></el-input>
            </el-form-item>
            <el-form-item label="微博话题">
              <el-input v-model="activity.title"></el-input>
            </el-form-item>
            <el-form-item label="选择分类">
              <el-select v-model="searchKey" filterable placeholder="请输入栏目进行搜索">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="视频连接(可选)">
              <el-input v-model="activity.term"></el-input>
            </el-form-item>
            <el-form-item label="活动简介">
              <el-input type="textarea" :rows="4" v-model="activity.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">提交</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 投票信息 -->
      <el-tab-pane label="投票信息" name="second">
        <div class="form-box">
          <el-form ref="form" :model="activity" label-width="100px">
            <el-form-item label="启用投票">
              <el-switch v-model="activity.voteOn" on-color="#13ce66" off-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="问题一">
              <p>XXXXXXXXXXXXXXXX? <el-tag type="success">单选</el-tag><el-button type="default" style="margin-left: 10px">编辑</el-button></p>
              <el-radio-group>
                <el-radio disabled label="单选"></el-radio>
                <el-radio disabled label="单选"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="问题二">
              <p>XXXXXXXXXXXXXXXX? <el-tag type="success">多选</el-tag><el-button type="default" style="margin-left: 10px">编辑</el-button></p>
              <el-checkbox disabled label="多选"></el-checkbox>
              <el-checkbox disabled label="多选"></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button type="default" @click.native.prevent="questionDialog = true">添加问题</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 添加问题 -->
        <el-dialog title="添加问题" v-model="questionDialog">
          <el-form label-width="100px" class="demo-dynamic">
            <el-form-item label="问题">
              <el-input v-model="question.title"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group>
                <el-radio label="单选"></el-radio>
                <el-radio label="多选"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-for="(option, index) in question.options" :label="'选项' + (index+1)" :key="option.key">
              <el-input :v-model="option"></el-input><el-button style="margin-left: 10px">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="addOption">新增选项</el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary">确 定</el-button>
            <el-button>取 消</el-button>
          </div>
        </el-dialog>     
      </el-tab-pane>

      <!-- 合作伙伴 -->
      <el-tab-pane label="合作伙伴" name="third">
        <!-- Table -->
        <el-table :data="partners">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="name" label="名字" min-width="120"></el-table-column>
          <el-table-column label="跳转链接" min-width="120">
            <template scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column label="LOGO" width="200">
            <template scope="scope">
              <img :src="scope.row.cover" width="200" max-height="200" @click="openImg(scope.row.cover)" style="cursor: pointer">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template scope="scope">
              <el-button type="default" size="small">编辑</el-button>
              <el-button type="default" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加按钮 -->
        <el-form style="margin-top: 20px">
          <el-form-item>
            <el-button @click="partnerDialog = true">添加合作伙伴</el-button>
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
              <el-upload action="" :file-list="newPartner.fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary">确 定</el-button>
            <el-button>取 消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: {
        title: '',
        options: []
      },
      newPartner: {},
      questionDialog: false,
      partnerDialog: false,
      searchKey: '',
      activity: {
        voteOn: true,
        tags: []
      },
      options: [
        { id: '1', value: '选项1', label: '选项1' },
        { id: '2', value: '选项2', label: '选项2' },
        { id: '3', value: '选项3', label: '选项3' },
        { id: '4', value: '选项4', label: '选项4' },
        { id: '5', value: '选项5', label: '选项5' }
      ],
      partners: [
        { name: '合作伙伴1', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴2', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴3', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴4', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴5', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' },
        { name: '合作伙伴6', cover: 'http://om4r3bojb.bkt.clouddn.com/index-banner.jpg', url: 'http://baidu.com' }
      ]
    }
  },
  methods: {
    addOption() {
      console.log(1111)
      this.question.options.push('')
    }
  }
}
</script>
