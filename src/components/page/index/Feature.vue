<template>
  <div>
    <el-tabs v-model="activeName">
      
      <!-- 精选文章 -->
      <el-tab-pane label="精选文章" name="first">
        <el-table :data="featuredArticles">
          <!-- 栏目长度 100 120 160 200 视情况而定 -->
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
          <el-table-column prop="author" label="作者" min-width="60"></el-table-column>
          <el-table-column prop="term" label="期数" width="80"></el-table-column>
          <el-table-column prop="column" label="栏目" width="100"></el-table-column>
          <el-table-column prop="order" label="顺序" width="70"></el-table-column>
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
            <el-button @click="featuredArticleParams.dialog = true">添加文章</el-button> 最多7篇
          </el-form-item>
        </el-form>
        <!-- 添加精选文章 -->
        <el-dialog title="添加精选文章" v-model="featuredArticleParams.dialog">
          <el-form label-width="100px">
            <el-form-item label="选择文章" >
              <el-select v-model="featuredArticleParams.searchKey" filterable placeholder="请输入文章标题进行搜索">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input v-model="featuredArticleParams.order" placeholder="输入数字，数字越大越排前"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary">确 定</el-button>
            <el-button>取 消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!-- 精选新媒体 -->
      <el-tab-pane label="精选新媒体" name="second">
        <el-table :data="featuredArticles">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
          <el-table-column prop="author" label="作者" min-width="60"></el-table-column>
          <el-table-column prop="term" label="期数" width="80"></el-table-column>
          <el-table-column prop="column" label="栏目" width="100"></el-table-column>
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
            <el-button @click="featuredNewmediaParams.dialog = true">添加文章</el-button> 最多8篇
          </el-form-item>
        </el-form>
        <!-- 添加精选文章 -->
        <el-dialog title="添加精选文章" v-model="featuredNewmediaParams.dialog">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="选择文章">
              <el-select v-model="featuredNewmediaParams.searchKey" filterable placeholder="请输入文章标题进行搜索">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input v-model="featuredArticleParams.order" placeholder="输入数字，数字越大越排前"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary">确 定</el-button>
            <el-button>取 消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!-- 精选视频 -->
      <el-tab-pane label="精选视频" name="third">
        <!-- Table -->
        <el-table :data="featuredVideos">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
          <el-table-column label="视频链接" min-width="120">
            <template scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column label="时长" width="100">
            <template scope="scope">{{scope.row.length}}</template>
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
            <el-button @click="featuredVideoParams.dialog = true">添加视频</el-button> 最多5个
          </el-form-item>
        </el-form>
        <!-- 添加精选视频 -->
        <el-dialog title="添加精选视频" v-model="featuredVideoParams.dialog">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="选择视频">
              <el-select v-model="featuredVideoParams.searchKey" filterable placeholder="请输入视频标题进行搜索">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input v-model="featuredArticleParams.order" placeholder="输入数字，数字越大越排前"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary">确 定</el-button>
            <el-button>取 消</el-button>
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
          <el-form label-position="right" label-width="100px">
            <el-form-item label="选择音频">
              <el-select v-model="featuredArticleParams.searchKey" filterable placeholder="请输入音频标题进行搜索">
                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
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
