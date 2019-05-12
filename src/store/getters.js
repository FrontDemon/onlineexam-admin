const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.admin.userInfo,
  paperId: state => state.admin.paperId,
  unReplyCount: state => state.admin.unReplyCount
/*  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles*/
}
export default getters
