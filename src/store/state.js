export default {
    token: window.localStorage.getItem('token') ? localStorage.getItem('token') : '',
    userId: window.localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
    height: window.innerHeight - 40,
    chatWebsocket: null,
    messages: new Map(),
    enterpriseId: undefined,
    enterpriseName: '',
    isShow: false,
    isInfoShow: false,
    isAlter: false
}