<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.imgTitle" placeholder="搜索图片标题" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.admName" placeholder="搜索管理员姓名" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves style="margin-left: 0;margin-right: 10px;" class="filter-item" type="primary" icon="el-icon-picture" @click="handlePreview">
        轮播图预览
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
      <el-table-column label="序号" prop="tno" sortable align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.imgTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轮播图片" align="center">
        <template slot-scope="scope">
          <viewer>
            <img :src="scope.row.imgSrc" style="width: 120px;height: 60px;border-radius: 5px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column prop="imgCreateTime" sortable label="轮播图创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.imgCreateTime | date-format }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ano" sortable label="创建轮播图的管理员号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ano }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建轮播图的管理员姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.admName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="200">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" icon="el-icon-edit-outline" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteRotationImg(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="图片标题" prop="imgTitle">
          <el-input v-model="temp.imgTitle" :rows="5" type="textarea" />
        </el-form-item>
        <el-form-item label="轮播图片" prop="imgSrc">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="/api/tea 。cher/uploadPicture">
            <img v-if="temp.imgSrc" :src="temp.imgSrc" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <el-button v-waves :disabled="!temp.imgSrc" type="danger" icon="el-icon-delete" size="mini" @click="deletePictureSrc">
            删除
          </el-button>
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
      <el-carousel :interval="4000" arrow="always">
        <el-carousel-item v-for="item in list" :key="item.imgId">
          <img :src="item.imgSrc" style="width: 100%;height: 100%">
          <h3>{{ item.imgTitle }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetRotationImgsList, reqSearchRotationImgsList, reqInsertRotationImgInfo, reqUpdateRotationImgInfo, reqDeleteRotationImg } from '@/api/rotationImg'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'
export default {
  name: 'RotationTable',
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
        imgTitle: undefined,
        admName: undefined
      },
      temp: {
        imgTitle: '',
        imgSrc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogRotationImgVisible: false,
      rules: {
        imgTitle: [{ required: true, message: '图片标题为必填项', trigger: 'change' }],
        imgSrc: [{ required: true, message: '请上传轮播图片', trigger: 'change' }]
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
      const result = await reqGetRotationImgsList()
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟0.5秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    confirmDeleteRotationImg(row) {
      this.$confirm('确定删除该轮播图吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDeleteRotationImg(row)
      }).catch(() => {
      })
    },
    async handleDeleteRotationImg(row) {
      const result = await reqDeleteRotationImg(row.imgId)
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
      const result = await reqSearchRotationImgsList(this.listQuery.imgTitle, this.listQuery.admName)
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
        imgTitle: '',
        imgSrc: ''
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
          this.handleUpdateRotationImg()
        }
      })
    },
    async handleUpdateRotationImg() {
      const result = await reqUpdateRotationImgInfo(this.temp)
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
          this.insertRotationImgInfo()
        }
      })
    },
    async insertRotationImgInfo() {
      const temp = this.temp
      const admin = this.$store.state.admin.userInfo
      temp.ano = admin.ano
      temp.admName = admin.admName
      const result = await reqInsertRotationImgInfo(temp)
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
    async handlePreview() {
      const result = await reqGetRotationImgsList()
      if (result.statu === 0) {
        this.previewList = result.data
      }
      this.dialogRotationImgVisible = true
    },
    handleAvatarSuccess(res, file) {
      // this.temp.pictureSrc = URL.createObjectURL(file.raw)
      this.temp.imgSrc = res.data
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
      this.temp.imgSrc = ''
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
    width: 280px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 280px;
    height: 80px;
    display: block;
  }
</style>
