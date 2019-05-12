import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API + '/admin'

// 获取全部轮播图信息
export const reqGetRotationImgsList = () => ajax(BASE_URL + '/getRotationImgsList')
// 获取搜索轮播图信息
export const reqSearchRotationImgsList = (imgTitle, admName) => ajax(BASE_URL + '/searchRotationImgsList', { imgTitle, admName })
// 请求添加轮播图信息
export const reqInsertRotationImgInfo = (temp) => ajax(BASE_URL + '/insertRotationImgInfo', temp, 'POST')
// 请求更新轮播图信息
export const reqUpdateRotationImgInfo = (row) => ajax(BASE_URL + '/updateRotationImgInfo', row, 'POST')
// 请求删除轮播图
export const reqDeleteRotationImg = (imgId) => ajax(BASE_URL + '/deleteRotationImgInfo', { imgId }, 'POST')
