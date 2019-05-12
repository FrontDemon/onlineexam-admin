<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.langName" placeholder="搜索科目名称" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.langDesc" placeholder="搜索科目描述" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.langCreatedBy" placeholder="搜索科目创建者" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isRecommend" placeholder="搜索科目是否被推荐" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in recommendOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科目名称" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.langName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科目描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.langDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科目图像" align="center" width="100">
        <template slot-scope="scope">
          <viewer>
            <img :src="scope.row.langImgSrc" style="width: 40px;height: 40px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column label="科目创建者" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.langCreatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科目最后更新者" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.langLastChanger || '暂无更新记录' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="imgCreateTime" sortable label="科目最后更新时间" align="center" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.langChangeTime">{{ scope.row.langChangeTime | date-format }}</span>
          <span v-else>暂无更新记录</span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示推荐" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.isRecommend === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paperCount" sortable label="发布试卷数" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.paperCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="200">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" icon="el-icon-edit-outline" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteSubject(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="科目名称" prop="langName">
          <el-input v-model="temp.langName" />
        </el-form-item>
        <el-form-item label="科目描述" prop="langDesc">
          <el-input v-model="temp.langDesc" />
        </el-form-item>
        <el-form-item label="科目图像" prop="langImgSrc">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="/api/teacher/uploadPicture">
            <img v-if="temp.langImgSrc" :src="temp.langImgSrc" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <el-button v-waves :disabled="!temp.langImgSrc" type="danger" icon="el-icon-delete" size="mini" @click="deletePictureSrc">
            删除
          </el-button>
        </el-form-item>
        <el-form-item label="是否显示推荐" prop="isRecommend">
          <el-select v-model="temp.isRecommend" class="filter-item">
            <el-option v-for="item in recommendOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='添加'?createData():updateData()">
          {{ dialogStatus==='添加'?'确认添加':'确认编辑' }}
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
import { reqGetSubjectsList, reqSearchSubjectsList, reqDeleteSubject, reqInsertSubjectInfo, reqUpdateSubjectInfo } from '@/api/subject'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'
export default {
  name: 'SubjectTable',
  components: { Pagination, BackToTop },
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
        langName: undefined,
        langDesc: undefined,
        langCreatedBy: undefined,
        isRecommend: undefined
      },
      recommendOptions: [{ label: '是', key: '1' }, { label: '否', key: '0' }],
      temp: {
        langName: '',
        langDesc: '',
        langImgSrc: '',
        isRecommend: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogRotationImgVisible: false,
      rules: {
        langName: [{ required: true, message: '科目名称为必填项', trigger: 'change' }],
        langDesc: [{ required: true, message: '科目描述为必填项', trigger: 'change' }],
        langImgSrc: [{ required: true, message: '请上传科目图像', trigger: 'change' }],
        isRecommend: [{ required: true, message: '是否显示推荐为必选项', trigger: 'change' }]
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await reqGetSubjectsList()
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟0.5秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    confirmDeleteSubject(row) {
      this.$confirm('确定删除该科目吗?若该科目下已有发布试卷则无法删除', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.paperCount > 0) {
          this.$message({
            message: '该科目已有发布试卷，无法删除',
            type: 'error'
          })
        } else {
          this.deleteSubject(row)
        }
      }).catch(() => {
      })
    },
    async deleteSubject(row) {
      const result = await reqDeleteSubject(row.langId)
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
      let isRecommend = this.listQuery.isRecommend
      if (this.listQuery.isRecommend === null || this.listQuery.isRecommend === undefined) {
        isRecommend = undefined
      }
      const result = await reqSearchSubjectsList(this.listQuery.langName, this.listQuery.langDesc, this.listQuery.langCreatedBy, isRecommend)
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟一秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    resetTemp() {
      this.temp = {
        langName: '',
        langDesc: '',
        langImgSrc: '',
        isRecommend: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象
      this.dialogStatus = '编辑'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.handleUpdateSubject()
        }
      })
    },
    async handleUpdateSubject() {
      const temp = this.temp
      const admin = this.$store.state.admin.userInfo
      temp.langLastChanger = admin.admName
      const result = await reqUpdateSubjectInfo(temp)
      if (result.statu === 0) {
        this.dialogFormVisible = false
        this.$message({
          message: result.msg,
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.insertSubjectInfo()
        }
      })
    },
    async insertSubjectInfo() {
      const temp = this.temp
      const admin = this.$store.state.admin.userInfo
      temp.langCreatedBy = admin.admName
      const result = await reqInsertSubjectInfo(temp)
      if (result.statu === 0) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
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
    handleAvatarSuccess(res, file) {
      // this.temp.pictureSrc = URL.createObjectURL(file.raw)
      this.temp.langImgSrc = res.data
    },
    beforeAvatarUpload(file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isType) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isType && isLt4M
    },
    deletePictureSrc() {
      this.temp.langImgSrc = ''
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>
