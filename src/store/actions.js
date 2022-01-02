export default {
  asyncSetToken(context, cur) {
    context.commit('setToken', cur);
  },
  asyncRmToken(context) {
    context.commit('rmToken');
  },
  asyncSetUserId(context, cur) {
    context.commit('setUserId', cur);
  },
  asyncRmUserId(context) {
    context.commit('rmUserId');
  },
  asyncSetHeight(context, cur) {
    context.commit('setHeight', cur);
  },
  asyncSetWebsocket(context, cur) {
    context.commit('setWebsocket', cur);
  },
  asyncRmWebsocket(context, cur) {
    context.commit('rmWebsocket', cur);
  },
  asyncSetMessages(context, cur) {
    context.commit('setMessages', cur);
  },
  asyncSetSelfMessages(context, cur) {
    context.commit('setSelfMessages', cur);
  },
  asyncSetEnterpriseId(context, cur) {
    context.commit('setEnterpriseId', cur);
  },
  asyncSetEnterpriseName(context, cur) {
    context.commit('setEnterpriseName', cur);
  },
  asyncSetIsShow(context, cur) {
    context.commit('setIsShow', cur);
  },
  asyncSetIsInfoShow(context, cur) {
    context.commit('setIsInfoShow', cur);
  },
  asyncSetIsAlter(context, cur) {
    context.commit('setIsAlter', cur);
  }
}