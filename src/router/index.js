import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard-2',
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },

  {
    path: '/student',
    component: Layout,
    redirect: '/student/student-info/info-table',
    name: 'Student',
    meta: { title: '学生管理', icon: 'student' },
    children: [
      {
        path: 'student-info',
        name: 'StudentInfo',
        component: () => import('@/views/student/studentInfo/index'),
        redirect: '/student/student-info/info-table',
        meta: { title: '信息管理', icon: 'info' },
        children: [
          {
            path: 'info-table',
            name: 'InfoTable',
            component: () => import('@/views/student/studentInfo/infoTable'),
            meta: { title: '学生信息管理', icon: 'student-info' }
          },
          {
            path: 'info-upload',
            name: 'InfoUpload',
            component: () => import('@/views/student/studentInfo/infoUpload'),
            meta: { title: '上传学生信息', icon: 'excel' }
          }
        ]
      },
      {
        path: 'score-table',
        name: 'ScoreTable',
        component: () => import('@/views/student/scoreTable'),
        meta: { title: '成绩管理', icon: 'score' }
      },
      {
        path: 'score-chart',
        name: 'ScoreChart',
        component: () => import('@/views/student/scoreChart'),
        meta: { title: '成绩图表', icon: 'chart' }
      }
    ]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/info-table',
    name: 'Teacher',
    meta: { title: '教师管理', icon: 'teacher' },
    children: [
      {
        path: 'info-table',
        name: 'TeacherTable',
        component: () => import('@/views/teacher/infoTable'),
        meta: { title: '教师信息管理', icon: 'teacher-info' }
      },
      {
        path: 'info-upload',
        name: 'TeacherUpload',
        component: () => import('@/views/teacher/infoUpload'),
        meta: { title: '上传教师信息', icon: 'excel' }
      }
    ]
  },

  {
    path: '/rotation-img',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'RotationImg',
        component: () => import('@/views/rotationImg/rotationTable'),
        meta: { title: '轮播图管理', icon: 'rotation-img' }
      }
    ]
  },

  {
    path: '/subject',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Subject',
        component: () => import('@/views/subject/subjectTable'),
        meta: { title: '科目管理', icon: 'subject' }
      }
    ]
  },

  {
    path: '/feedback',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Feedback',
        component: () => import('@/views/feedback/feedbackTable'),
        meta: { title: '留言管理', icon: 'feedback' }
      }
    ]
  },

  {
    path: 'my-homepage',
    component: Layout,
    children: [
      {
        path: 'http://maweitao.top',
        meta: { title: '个人主页', icon: 'link' }
      }
    ]
  },

  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Test',
        component: () => import('@/views/test/index'),
        meta: { title: '测试页面', icon: 'test' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
