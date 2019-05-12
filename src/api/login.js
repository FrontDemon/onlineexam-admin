/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API + '/admin'

// 校验管理员登录
export const reqLogin = (ano, admPsw) => ajax(BASE_URL + '/adminLogin', { ano, admPsw }, 'POST')
// 请求退出登录
export const reqLogOut = () => ajax(BASE_URL + '/adminLogOut')
