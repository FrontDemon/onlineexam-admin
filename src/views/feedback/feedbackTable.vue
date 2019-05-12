<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.feedbackContent" placeholder="搜索留言内容" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.stuName" placeholder="搜索留言人" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.admAnswer" placeholder="搜索回复内容" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.admName" placeholder="搜索回复人" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.feedbackStatus" placeholder="搜索留言回复状态" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in recommendOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'tno', order: 'ascending'}"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="tno" sortable align="center" width="100">
        <template slot-scope="scope">
          <el-badge :is-dot="scope.row.feedbackStatus === '0'" style="margin-top: 10px">
            <span>{{ scope.row.id }}</span>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="留言内容" align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.feedbackContent.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"/>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackCreateTime" sortable label="留言时间" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.feedbackCreateTime | date-format }}</span>
        </template>
      </el-table-column>
      <el-table-column label="留言人" align="center" width="120">
        <template slot-scope="scope">
          <div :class="{ 'read_bg_img': scope.row.feedbackStatus === '2', 'no_read_bg_img': scope.row.feedbackStatus === '1' }">
            <viewer>
              <img :src="scope.row.stuImgSrc || require('@/assets/images/profile.jpg')" style="width: 40px;height: 40px;border-radius: 20px">
            </viewer>
            <div>{{ scope.row.stuName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sno" sortable label="留言人ID" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.sno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.admAnswer" v-html="scope.row.admAnswer.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"/>
          <span v-else>待回复</span>
        </template>
      </el-table-column>
      <el-table-column label="回复人" align="center" width="120">
        <template slot-scope="scope">
          <viewer v-if="scope.row.admName">
            <img src="@/assets/images/admin.png" style="width: 40px;height: 40px;border-radius: 20px">
          </viewer>
          <div>{{ scope.row.admName || '待回复' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="ano" sortable label="回复人ID" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ano || '待回复' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replyTime" sortable label="回复时间" align="center" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.replyTime">{{ scope.row.replyTime | date-format }}</span>
          <span v-else>待回复</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="200">
        <template slot-scope="{row}">
          <div style="margin-top: 10px">
            <el-badge v-if="row.feedbackStatus === '0'" :value="1" type="warning" style="margin-right: 20px">
              <el-button size="small" @click="handleReply(row)">待回复</el-button>
            </el-badge>
            <el-button v-waves v-else size="mini" disabled>
              已回复
            </el-button>
            <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteFeedback(row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" title="留言回复">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px;height: 350px;margin-left:50px;">
        <el-form-item label="留言内容" prop="feedbackContent">
          <span v-html="temp.feedbackContent.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"/>
        </el-form-item>
        <el-form-item label="回复内容" prop="admAnswer">
          <el-input v-model="temp.admAnswer" :rows="5" type="textarea" />
          <i id="emotionBtn" :style="{ color: showEmotion?'#65b1ff':''}" class="iconfont iconbiaoqing" style="font-size: 24px;float: right" @click="clickEmotion" />
          <div v-show="showEmotion" id="emotionDiv" style="background: #ffffff">
            <emotion :height="200" @emotion="handleEmotion"/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmReply">
          确认回复
        </el-button>
      </div>
    </el-dialog>

    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>

    <el-dialog :visible.sync="dialogRotationImgVisible" title="轮播图预览">
      <el-carousel :interval="4000">
        <el-carousel-item v-for="item in list" :key="item.imgId">
          <img :src="item.imgSrc" style="width: 100%;height: 100%">
          <h3>{{ item.imgTitle }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetFeedbacksList, reqSearchFeedbacksList, reqDeleteFeedback, reqReplyFeedback } from '@/api/feedback'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'
import Emotion from '@/components/Emotion'
import $ from 'jquery'
export default {
  name: 'FeedbackTable',
  components: { Pagination, BackToTop, Emotion },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      previewList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        feedbackContent: undefined,
        stuName: undefined,
        admAnswer: undefined,
        admName: undefined,
        feedbackStatus: undefined
      },
      recommendOptions: [{ label: '待回复', key: '0' }, { label: '已回复', key: '1' }],
      temp: {
        feedbackContent: '',
        admAnswer: ''
      },
      dialogFormVisible: false,
      dialogRotationImgVisible: false,
      rules: {
        feedbackContent: [{ required: true }],
        admAnswer: [{ required: true, message: '请填写回复内容', trigger: 'change' }]
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      path: process.env.BASE_WEBSOCKET + this.$store.state.admin.userInfo.ano,
      socket: '',
      showEmotion: false
    }
  },
  created() {
    this.$store.dispatch('recordUnReplyCount')
    this.getList()
  },
  mounted() {
    // 初始化
    this.init()
    document.addEventListener('click', (e) => {
      if (!$(e.target).closest('#emotionBtn,#emotionDiv').length) {
        this.showEmotion = false
      }
    })
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await reqGetFeedbacksList()
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟0.5秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 0)
    },
    confirmDeleteFeedback(row) {
      this.$confirm('确定删除该留言吗?已回复且学生已读才可删除', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.feedbackStatus === '0') {
          this.$message({
            message: '该留言还未回复，无法删除',
            type: 'error'
          })
        } else if (row.feedbackStatus === '1') {
          this.$message({
            message: '该留言回复学生未读，无法删除',
            type: 'error'
          })
        } else {
          this.handleDeleteFeedback(row)
        }
      }).catch(() => {
      })
    },
    async handleDeleteFeedback(row) {
      const result = await reqDeleteFeedback(row.feedbackId)
      if (result.statu === 0) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      } else {
        this.$message({
          message: result.msg,
          type: 'error'
        })
      }
    },
    async handleFilter() {
      this.listQuery.page = 1
      this.listLoading = true
      let feedbackStatus = this.listQuery.feedbackStatus
      if (this.listQuery.feedbackStatus === null || this.listQuery.feedbackStatus === undefined) {
        feedbackStatus = undefined
      }
      let admAnswer = this.listQuery.admAnswer
      if (this.listQuery.admAnswer === '' || this.listQuery.admAnswer === undefined) {
        admAnswer = undefined
      }
      let admName = this.listQuery.admName
      if (this.listQuery.admName === '' || this.listQuery.admName === undefined) {
        admName = undefined
      }
      const result = await reqSearchFeedbacksList(this.listQuery.feedbackContent, this.listQuery.stuName, admAnswer, admName, feedbackStatus)
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟一秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleReply(row) {
      this.temp = Object.assign({}, row) // 复制对象
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    confirmReply() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.replyFeedback()
        }
      })
    },
    async replyFeedback() {
      const temp = this.temp
      const admin = this.$store.state.admin.userInfo
      temp.ano = admin.ano
      temp.admName = admin.admName
      const result = await reqReplyFeedback(temp)
      if (result.statu === 0) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '回复成功',
          type: 'success',
          duration: 2000
        })
        this.$store.dispatch('recordUnReplyCount')
        this.getList()
      } else {
        this.$notify({
          title: '失败',
          message: result.msg,
          type: 'error',
          duration: 2000
        })
      }
    },
    init: function() {
      if (typeof (WebSocket) === undefined) {
        this.$message.error('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function() {
      console.log('socket连接成功')
    },
    error: function() {
      console.log('连接错误')
    },
    getMessage: function(msg) {
      console.log(msg.data)
      if (msg.data === '留言') {
        this.$store.dispatch('recordUnReplyCount')
        this.getList()
      }
    },
    send: function(message) {
      this.socket.send(message)
    },
    close: function() {
      console.log('socket已经关闭')
    },
    // 将匹配结果替换表情图片
    emotion(res) {
      const word = res.replace(/\#|\;/gi, '')
      const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
      const index = list.indexOf(word)
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" style="position: relative;top: 4px">`
    },
    clickEmotion() {
      this.showEmotion = !this.showEmotion
    },
    handleEmotion(i) {
      if (this.temp.admAnswer === null) {
        this.temp.admAnswer = ''
      }
      this.temp.admAnswer += i
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
  .read_bg_img {
    background-image: url("http://qiniu.maweitao.top/read.png");
    background-size: 30px 35px;
    background-repeat: no-repeat;
    background-position: 100% 0;
  }
  .no_read_bg_img {
    background-image: url("http://qiniu.maweitao.top/no_read.png");
    background-size: 30px 35px;
    background-repeat: no-repeat;
    background-position: 100% 0;
  }
</style>
