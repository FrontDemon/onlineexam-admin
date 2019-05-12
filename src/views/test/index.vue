<template>
  <div class="app-container">
    <div class="filter-container">
      你的编号：{{ ano }}
    </div>
    <div class="filter-container">
      <el-input v-model="sendMessage" placeholder="输入发送消息" clearable style="width: 400px;margin-right: 15px;" class="filter-item"/>
      <el-button class="filter-item" style="margin-right: 10px;" type="primary" @click="send">
        发送消息
      </el-button>
      <el-button class="filter-item" style="margin-right: 10px;" type="primary" @click="close">
        关闭WebSocket连接
      </el-button>
    </div>
    <div class="filter-container" v-html="displayMessage"/>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'Test',
  data() {
    return {
      ano: this.$store.state.admin.userInfo.ano,
      path: 'ws://localhost:8080/api/websocket/' + this.$store.state.admin.userInfo.ano,
      socket: '',
      sendMessage: '',
      displayMessage: ''
    }
  },
  mounted() {
    // 初始化
    this.init()
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close
  },
  methods: {
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
      this.displayMessage += 'socket连接成功<br/>'
    },
    error: function() {
      console.log('连接错误')
      this.displayMessage += '连接错误<br/>'
    },
    getMessage: function(msg) {
      console.log(msg.data)
      this.displayMessage += msg.data + '<br/>'
    },
    send: function() {
      let message = ''
      const now = parseTime(new Date())
      message = now + '发送人：' + this.ano + '<br/>' + '---' + this.sendMessage
      this.displayMessage += message + '<br/>'
      const toSendUserno = '123456'
      this.socket.send(this.sendMessage + '|' + toSendUserno)
    },
    close: function() {
      console.log('socket已经关闭')
      this.displayMessage += 'socket已经关闭<br/>'
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>

</style>
