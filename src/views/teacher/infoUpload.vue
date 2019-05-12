<template>
  <div class="app-container">
    <div style="display: flex;justify-content: center;margin-bottom: 20px">
      <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        请先下载教师信息上传模板
      </el-button>
    </div>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <div v-if="allItemCount" style="margin-top: 15px" >
      <span style="color: #4ab7bd">上传总记录条数：{{ allItemCount }}</span>
      <span style="color: #67c23a;margin-left: 30px">成功总记录条数：{{ successItemCount }}</span>
      <span style="color: #FF0000;margin-left: 30px">失败总记录条数：{{ failItemCount }}</span>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import waves from '@/directive/waves' // Waves directive
import { reqInsertTeacherInfoList } from '@/api/teacher'
export default {
  name: 'InfoUpload',
  components: { UploadExcelComponent },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      tableData: [],
      tableHeader: [],
      allItemCount: 0,
      successItemCount: 0,
      failItemCount: 0
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '(必填)教工号(6位数字)',
          '(必填)姓名',
          '(必填)性别(填男或者女)'
        ]
        excel.export_json_to_excel({
          header: tHeader,
          data: [],
          filename: '教师信息上传模板'
        })
        this.downloadLoading = false
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请上传小于1M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      const teacherList = []
      results.forEach((item, index) => {
        const teacher = {}
        Object.keys(item).forEach((key) => {
          if (key === '(必填)教工号(6位数字)') {
            teacher.tno = (String)(item[key])
          }
          if (key === '(必填)姓名') {
            teacher.teaName = item[key]
          }
          if (key === '(必填)性别(填男或者女)') {
            teacher.teaSex = item[key]
          }
        })
        teacherList.push(teacher)
      })
      this.insertTeacherInfoList(teacherList)
    },
    // 插入数据库教师信息表
    async insertTeacherInfoList(teacherList) {
      const result = await reqInsertTeacherInfoList(teacherList)
      if (result.statu === 0) {
        this.tableHeader = ['教工号', '姓名', '性别', '上传状态']
        this.tableData = result.data.responseList
        this.allItemCount = result.data.allItemCount
        this.successItemCount = result.data.successItemCount
        this.failItemCount = result.data.failItemCount
        this.$message({
          message: result.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: result.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>

</style>
