<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs plugins-tips">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-date"></i> 网站</el-breadcrumb-item>
        <el-breadcrumb-item>首页管理</el-breadcrumb-item>
        <el-breadcrumb-item>精选管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-tabs v-model="activeName">
      
      <!-- 精选文章 -->
      <el-tab-pane label="精选文章" name="first">
        <el-table :data="featuredArticles" stripe style="width: 100%">
          <!-- 栏目长度 100 120 160 200 视情况而定 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column prop="term" label="期数"></el-table-column>
          <el-table-column prop="column" label="栏目"></el-table-column>
          <el-table-column prop="order" label="次序"></el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button type="default" size="small">编辑</el-button>
              <el-button type="default" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加按钮 -->
        <el-form style="margin-top: 20px">
          <el-form-item>
            <el-button @click="featuredArticleParams.dialog = true">添加文章</el-button> 最多7篇
          </el-form-item>
        </el-form>
        <!-- 添加精选文章 -->
        <el-dialog title="添加精选文章" v-model="featuredArticleParams.dialog" style="z-index: 999">
          <el-form label-position="right">
            <el-form-item label="选择文章" label-width="120px">
              <el-select v-model="featuredArticleParams.searchKey" filterable placeholder="请输入文章标题进行搜索" style="width: 70%">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序" label-width="120px" style="width: 70%">
              <el-input v-model="featuredArticleParams.order" placeholder="输入数字，数字越大越排前"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="featuredArticleParams.dialog = false">取 消</el-button>
            <el-button type="primary" @click="featuredArticleParams.dialog = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!-- 精选新媒体 -->
      <el-tab-pane label="精选新媒体" name="second">
        <el-table :data="featuredArticles" stripe style="width: 100%">
          <!-- 栏目长度 100 120 160 200 视情况而定 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column prop="term" label="期数"></el-table-column>
          <el-table-column prop="column" label="栏目"></el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button type="default" size="small">编辑</el-button>
              <el-button type="default" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加按钮 -->
        <el-form style="margin-top: 20px">
          <el-form-item>
            <el-button @click="featuredNewmediaParams.dialog = true">添加文章</el-button> 最多8篇
          </el-form-item>
        </el-form>
        <!-- 添加精选文章 -->
        <el-dialog title="添加精选文章" v-model="featuredNewmediaParams.dialog">
          <el-form label-position="right">
            <el-form-item label="选择文章" label-width="120px">
              <el-select v-model="featuredNewmediaParams.searchKey" filterable placeholder="请输入文章标题进行搜索" style="width: 70%">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序" label-width="120px" style="width: 70%">
              <el-input v-model="featuredArticleParams.order" placeholder="输入数字，数字越大越排前"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="featuredNewmediaParams.dialog = false">取 消</el-button>
            <el-button type="primary" @click="featuredNewmediaParams.dialog = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!-- 精选视频 -->
      <el-tab-pane label="精选视频" name="third">
        <!-- Table -->
        <el-table :data="featuredVideos" stripe style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column label="视频链接">
            <template scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column label="时长">
            <template scope="scope">{{scope.row.length}}</template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button type="default" size="small">编辑</el-button>
              <el-button type="default" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加按钮 -->
        <el-form style="margin-top: 20px">
          <el-form-item>
            <el-button @click="featuredVideoParams.dialog = true">添加视频</el-button> 最多5个
          </el-form-item>
        </el-form>
        <!-- 添加精选视频 -->
        <el-dialog title="添加精选视频" v-model="featuredVideoParams.dialog">
          <el-form label-position="right">
            <el-form-item label="选择视频" label-width="120px">
              <!-- 可调用接口搜索 TODO -->
              <el-select v-model="featuredVideoParams.searchKey" filterable placeholder="请输入视频标题进行搜索" style="width: 70%">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序" label-width="120px" style="width: 70%">
              <el-input v-model="featuredArticleParams.order" placeholder="输入数字，数字越大越排前"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="featuredVideoParams.dialog = false">取 消</el-button>
            <el-button type="primary" @click="featuredVideoParams.dialog = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!-- 精选音频 -->
      <el-tab-pane label="精选音频" name="fourth">
        <el-form ref="form" :model="featureAudio" label-width="80px">
          <el-form-item label="音频">
            <span>{{featureAudio.title}}</span>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="featureAudio.dialog = true">替换</el-button>
          </el-form-item>
        </el-form>
        <!-- 添加精选文章 -->
        <el-dialog title="选择精选音频" v-model="featureAudio.dialog">
          <el-form label-position="right">
            <el-form-item label="选择音频" label-width="120px">
              <el-select v-model="featuredArticleParams.searchKey" filterable placeholder="请输入音频标题进行搜索" style="width: 70%">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="featuredArticleParams.dialog = false">取 消</el-button>
            <el-button type="primary" @click="featuredArticleParams.dialog = false">确 定</el-button>
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
      activeName: 'first',
      options: [
        { id: '1', value: '选项1', label: '选项1' },
        { id: '2', value: '选项2', label: '选项2' },
        { id: '3', value: '选项3', label: '选项3' },
        { id: '4', value: '选项4', label: '选项4' },
        { id: '5', value: '选项5', label: '选项5' }
      ],
      featuredArticleParams: {
        searchKey: '',
        dialog: false
      },
      featuredNewmediaParams: {
        searchKey: '',
        dialog: false
      },
      featuredArticles: [
        { order: '1', title: '这是标题1', author: '新周刊', term: 480, column: '生活' },
        { order: '1', title: '这是标题2', author: '新周刊', term: 480, column: '生活' },
        { order: '1', title: '这是标题3', author: '新周刊', term: 480, column: '生活' },
        { order: '1', title: '这是标题4', author: '新周刊', term: 480, column: '生活' },
        { order: '1', title: '这是标题5', author: '新周刊', term: 480, column: '生活' },
        { order: '1', title: '这是标题6', author: '新周刊', term: 480, column: '生活' }
      ],
      featuredVideoParams: {
        searchKey: '',
        dialog: false
      },
      featuredVideos: [
        { title: '这是标题1', url: 'http://baidu.com', length: '20"20"' },
        { title: '这是标题2', url: 'http://baidu.com', length: '20"20"' },
        { title: '这是标题3', url: 'http://baidu.com', length: '20"20"' },
        { title: '这是标题4', url: 'http://baidu.com', length: '20"20"' },
        { title: '这是标题5', url: 'http://baidu.com', length: '20"20"' },
        { title: '这是标题6', url: 'http://baidu.com', length: '20"20"' }
      ],
      featureAudio: {
        title: '老屋，旧房，砖瓦',
        dialog: false
      }
    }
  }
}
</script>
