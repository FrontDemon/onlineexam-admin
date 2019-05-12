import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API + '/admin'

// 获取全部教师信息
export const reqGetTeachersList = () => ajax(BASE_URL + '/getTeachersList')
// 请求搜索教师信息
export const reqSearchTeachersList = (tno, teaName, teaSex) => ajax(BASE_URL + '/searchTeacherInfo', { tno, teaName, teaSex })
// 请求更新教师信息
export const reqUpdateTeacherInfo = (row) => ajax(BASE_URL + '/updateTeacherInfo', row, 'POST')
// 请求添加教师信息
export const reqInsertTeacherInfo = (temp) => ajax(BASE_URL + '/insertTeacherInfo', temp, 'POST')
// 插入上传教师信息数据
export const reqInsertTeacherInfoList = (teacherList) => ajax(BASE_URL + '/insertTeacherInfoList', { teacherList }, 'POST')
