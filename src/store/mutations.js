export default {
  setToken(state, cur) {
    window.localStorage.setItem('token', cur);
    state.token = cur;
  },
  rmToken(state) {
    window.localStorage.removeItem('token');
    state.token = '';
  },
  setUserId(state, cur) {
    window.localStorage.setItem('userId', cur);
    state.userId = cur;
  },
  rmUserId(state) {
    window.localStorage.removeItem('userId');
    state.userId = '';
  },
  setHeight(state, cur) {
    state.height = cur;
  },
  setChatWebsocket(state, cur) {
    state.chatWebsocket = cur;
  },
  rmChatWebsocket(state) {
    state.chatWebsocket = null;
  },
  setMessages(state, cur) {
    if (cur instanceof Array) {
      for (let item of cur) {
        if (!state.messages.has(item.from)) {
          state.messages.set(item.from, []);
        }
        state.messages.get(item.from).push(item);
      }
    } else {
      if (!state.messages.has(cur.from)) {
        state.messages.set(cur.from, []);
      }
      state.messages.get(cur.from).push(cur);
    }
  },
  setSelfMessages(state, cur) {
    if (!state.messages.has(cur.to)) {
      state.messages.set(cur.to, []);
    }
    state.messages.get(cur.to).push(cur);
  },
  setEnterpriseId(state, cur) {
    state.enterpriseId = cur;
  },
  setEnterpriseName(state, cur) {
    state.enterpriseName = cur;
  },
  setIsShow(state, cur) {
    state.isShow = cur;
  },
  setIsInfoShow(state, cur) {
    state.isInfoShow = cur;
  },
  setIsAlter(state, cur) {
    state.isAlter = cur;
  }
}