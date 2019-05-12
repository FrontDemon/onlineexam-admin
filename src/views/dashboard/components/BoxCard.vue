<template>
  <el-card class="box-card-component">
    <div slot="header" class="box-card-header">
      <img src="@/assets/images/info_tab_img.png">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="admImg" class="panThumb" />
      <mallki class-name="mallki-text" text="在线考试系统管理员端" />
      <div style="padding-top:35px;" class="progress-item">
        <div class="info_item">
          <span>管理员ID</span>
          <span>{{ userInfo.ano }}</span>
        </div>
        <el-progress :percentage="100" status="success" />
      </div>
      <div class="progress-item">
        <div class="info_item">
          <span>姓名</span>
          <span>{{ userInfo.admName }}</span>
        </div>
        <el-progress :percentage="100" status="success" />
      </div>
      <div class="progress-item">
        <div class="info_item">
          <span>性别</span>
          <span>{{ userInfo.admSex }}</span>
        </div>
        <el-progress :percentage="100" status="success" />
      </div>
      <div class="progress-item">
        <div class="info_item">
          <span>邮箱</span>
          <span>{{ userInfo.admEmail }}</span>
        </div>
        <el-progress :percentage="100" status="success" />
      </div>
      <div class="progress-item">
        <div class="info_item">
          <span>手机号码</span>
          <span>{{ userInfo.admPhone }}</span>
        </div>
        <el-progress :percentage="100" status="success" />
      </div>
      <div class="progress-item">
        <div class="info_item">
          <span>最近登录时间</span>
          <span>{{ userInfo.admLastLoginTime | date-format }}</span>
        </div>
        <el-progress :percentage="100" status="success" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      admImg: require('@/assets/images/admin.png'),
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style type="text/scss" lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    /deep/ .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
    .info_item {
      display: flex;
      justify-content: space-between;
      padding-right: 50px;
    }
  }
  /*@media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }*/
}
</style>
