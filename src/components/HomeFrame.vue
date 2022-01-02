<template>
  <div id="home-frame" ref="homeframe">
    <div class="banner">
      <div class="banner-left">
        <a class="banner-home" @click="toHome">
          <div class="banner-homebg"></div>
          <div>首页</div>
        </a>
        <a class="banner-findStaff" @click="toStaff">员工搜索</a>
        <a class="banner-uploadStaff" @click="toUpload">上传员工信息</a>
      </div>
      <div class="banner-middle"></div>
      <div class="banner-right"  v-if="token != ''">
        <div class="banner-right-person">
          <div class="banner-right-person-avatar" :style="style"></div>
          <div class="banner-right-person-name">
            <div><a @click="toUser">{{userName}}</a></div>
            <div class="banner-right-person-name-order">
              <ul class="banner-right-person-name-order-list">
                <li><a class="down-list" @click="toUser">个人中心</a></li>
                <li><a class="down-list" @click="toWallet">我的钱包</a></li>
                <li><a class="down-list" @click="toAuthority">我的订单</a></li>
                <li class="banner-right-person-name-order-list-line"></li>
                <li class="banner-right-person-name-order-list-exit">
                  <a class="down-list" @click="logout">退出</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <a class="banner-right-message" @click="showChatFrame">消息</a>
      </div>
      <div class="banner-right" v-else style="display: flex">
        <a class="banner-right-message" @click="register">注册</a>
        <a class="banner-right-message" @click="login">登录</a>
      </div>
    </div>
    <el-drawer
      v-model="isChatShow"
      title="消息"
    >
      <div v-if="size == 0">您暂时没有接收到消息哦！</div>
      <div v-else v-for="[key, value] in messages" :key="key" style="width: 80%; margin: auto;">
        <div class="msg-cell" @click="openMsg(key)">
          <div style="flex: 1; text-align: center">
            <el-image :src="require('../assets/img/ico/' + key + '.jpg') ? require('../assets/img/ico/' + key + '.jpg') : require('../assets/img/ico/default.jpg')" style="width: 50px; height: 50px; margin: auto;"/>
          </div>
          <div style="flex: 3">
            <div style="font-size: 16px; font-weight: bold;margin-bottom: 14px;">{{value[0].fromName}}</div>
            <div style="color: #555; font-size: 12px;">{{value[value.length - 1].message[0]}}</div>
          </div>
        </div>
      </div>
    </el-drawer>
      <el-dialog v-model="isChatBoxShow" :title="enterpriseName">
        <chat-box></chat-box>
      </el-dialog>
    <complete-info/>
    <el-scrollbar :noresize="true">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script>
import {request} from '@/network/request';
import {initWebsocket} from '@/network/websocket';
import { ElMessage } from 'element-plus';
import ChatBox from '@/components/chat/ChatBox';
import CompleteInfo from '@/components/userInfo/CompleteInfo';

export default {
  name: 'HomeFrame',
  components: {
    ChatBox,
    CompleteInfo
  },
  data() {
    return {
      token: this.$store.state.token,
      userId: this.$store.state.userId,
      userName: '',
      style: '',
      isChatShow: false,
      isChatBoxShow: false
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    size() {
      let size = 0;
      for (let item of this.$store.state.messages) {
        if (item[0] != this.userId) {
          size++;
        }
      }
      return size;
    },
    enterpriseName() {
      return this.$store.state.enterpriseName;
    },
    isShow() {
      return this.$store.state.isShow;
    }
  },
  watch: {
    isShow(newV, oldV) {
      if (newV == true && oldV == false) {
        this.isChatBoxShow = true;
      }
    },
    isChatBoxShow(newV, oldV) {
      if (newV == false && oldV == true) {
        this.$store.dispatch('asyncSetIsShow', false);
      }
    }
  },
  methods: {
    logout() {
      this.$router.push('/')
      this.$store.dispatch('asyncRmToken');
      this.$store.dispatch('asyncRmUserId');
      this.$store.dispatch('asyncRmChatWebsocket');
      request({
        url: '/api/logout',
        method: 'POST'
      }).then(res => {
        if (res.data.code === '00000') {
          ElMessage({
            showClose: true,
            message: '退出成功',
            type: 'success',
          });
          this.$router.go(0);
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'warn'
          })
        }
      });
    },
    login() {
      this.$router.push('/login_and_register/login');
    },
    register() {
      this.$router.push('/login_and_register/register');
    },
    toHome() {
      this.$router.push('/home');
    },
    toStaff() {
      this.$router.push('/home/staffs');
    },
    toUpload() {
      this.$router.push('/home/upload');
    },
    toUser() {
      this.$router.push('/home/user');
    },
    toWallet() {
      this.$router.push('/home/user/wallet');
    },
    toAuthority() {
      this.$router.push('/home/user/authority');
    },
    showChatFrame() {
      this.isChatShow = true;
    },
    openMsg(id) {
      this.$store.dispatch('asyncSetEnterpriseId', id);
      this.$store.dispatch('asyncSetIsShow', true);
      request({
        url: '/demander/get_name/' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers':'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          this.$store.dispatch('asyncSetEnterpriseName', res.data.userName);
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
    }
  },
  created() {
    if (this.token != '') {
      request({
        url: '/api/get_name',
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers':'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          this.userName = res.data.userName != null ? res.data.userName : 'Guest';
          if (this.userId != '') {
            let ico = '';
            try {
              ico = require('../assets/img/ico/' + this.$store.state.userId + '.jpg');
            } catch {
              ico = require('../assets/img/ico/default.jpg');
            }
            this.style = 'background-image: url(' + ico + ');background-size: 25px 25px;';
          }
        } else {
          this.userName = 'Guest';
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
          this.$store.dispatch('asyncRmToken');
          this.$store.dispatch('asyncRmUserId');
          this.$router.go(0);
        }
      });
      this.$store.state.chatWebsocket = initWebsocket({
        url: '/chat/' + this.userId,
        onopen: () => {
          console.log('客户端WebSocket已连接');
        },
        onerror: e =>{
          console.log('WebSocket连接异常', e);
        },
        onmessage: msg => {
          msg = JSON.parse(msg.data).data;
          if (msg instanceof Array) {
            for (let item of msg) {
              request({
                url: '/demander/get_name/' + item.from,
                method: 'POST',
                headers: {
                  'Access-Control-Expose-Headers':'Token',
                  'token': this.$store.state.token
                }
              }).then(res => {
                if (res.data.code === '00000') {
                  item.fromName = res.data.userName;
                } else {
                  ElMessage({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error',
                  });
                }
              });
            }
          } else {
            request({
              url: '/demander/get_name/' + msg.from,
              method: 'POST',
              headers: {
                'Access-Control-Expose-Headers':'Token',
                'token': this.$store.state.token
              }
            }).then(res => {
              if (res.data.code === '00000') {
                msg.fromName = res.data.userName;
              } else {
                ElMessage({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error',
                });
              }
            });
          }
          this.$store.dispatch('asyncSetMessages', msg);
        },
        onclose: ()=>{
          console.log('客户端WebSocket断开连接');
        }
      });
    }
  },
  mounted() {
    //创建颜色类，Color类返回字符串型rgba（*,*,*,.8）
    class Color {
      constructor(min) {
        min = min || 0;
        this.r = colorValue(min);
        this.g = colorValue(min);
        this.b = colorValue(min);
        this.style = createColorStyle(this.r, this.g, this.b);
      }
    }
    //创建Dot类以及一系列方法
    class Dot {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();

        this.radius = Math.random() * 2;

        this.color = new Color();
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color.style;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }
    }
    // function mixComponents(comp1, weight1, comp2, weight2) {
    //   return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    // }
    // function averageColorStyles(dot1, dot2) {
    //   let color1 = dot1.color,
    //     color2 = dot2.color;

    //   let r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
    //     g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
    //     b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
    //   return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    // }
    function colorValue(min) {
      return Math.floor(Math.random() * (255 - min) + min);
    }
    function createColorStyle(r, g, b) {
      return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
    }

    function moveDots() {//Dot对象的移动
      for (let i = 0; i < dots.nb; i++) {

        let dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vy = - dot.vy;
        }
        else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = - dot.vx;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    }
    // function connectDots() {//DOt对象的连接
    //   for (let i = 0; i < dots.nb; i++) {
    //     for (let j = i; j < dots.nb; j++) {
    //       let i_dot = dots.array[i];
    //       let j_dot = dots.array[j];

    //       if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance) {
    //         if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius) {
    //           ctx.beginPath();
    //           ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
    //           ctx.moveTo(i_dot.x, i_dot.y);
    //           ctx.lineTo(j_dot.x, j_dot.y);
    //           ctx.stroke();//绘制定义的路线
    //           ctx.closePath();//创建从当前点回到起始点的路径
    //         }
    //       }
    //     }
    //   }
    // }
    function createDots() {//创建nb个Dot对象
      for (let i = 0; i < dots.nb; i++) {
        dots.array.push(new Dot());
      }
    }
    function drawDots() {//引用Dot原型链，使用draw方法，在canvas上画出Dot对象
      for (let i = 0; i < dots.nb; i++) {
        let dot = dots.array[i];
        dot.draw();
      }
    }
    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);//清除画布，否则线条会连在一起
      moveDots();
      // connectDots();
      drawDots();
      requestAnimationFrame(animateDots);
    }
    this.$refs.homeframe.style.background = "azure";
    //创建canvas画布
    this.$refs.homeframe.appendChild(document.createElement('canvas'));
    let canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'); //ctx返回一个在canvas上画图的api/dom
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    ctx.lineWidth = .3;
    ctx.strokeStyle = (new Color(200)).style;
    //定义鼠标覆盖范围
    let mousePosition = {
      x: 30 * canvas.width / 100,
      y: 30 * canvas.height / 100
    };
    let dots = {
      nb: 500,//Dot的总数
      distance: 50,
      d_radius: 100,
      array: []
    };

    createDots();//使用创建Dot类函数
    requestAnimationFrame(animateDots);//使用canvas独有的60Hz刷新屏幕画布的方法

    document.querySelector('canvas').addEventListener('mousemove', function (e) {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    })

    document.querySelector('canvas').addEventListener('mouseleave', function () {//鼠标离开时，连接自动返回到画布中心
      mousePosition.x = -100;
      mousePosition.y = -100;
    })
  }
}
</script>

<style scoped>

*:deep() .el-dialog {
  padding: 0;
  width: fit-content;
  height: fit-content;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.85);
}

*:deep() .el-dialog__header {
  width: fit-content;
  margin: auto;
  font-weight: bold;
}

*:deep() .el-dialog__body {
  width: fit-content;
  margin: 0;
  padding: 0;
}

.msg-cell {
  padding: 10px 0;
  display: flex;
  box-shadow: 0 0 3px rgba(0,0,0,0.2);
  margin-bottom: 2px;
}

#home-frame {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  user-select: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: auto;
  margin: 0;
  padding: 0;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

canvas {
  z-index: 2;
}

body div {
  z-index: 2;
}

a {
  display: flex;
  transition: color 0.5s;
  text-decoration: none;
  cursor: pointer;
  color: lightblue;
}

a:hover {
  color: #fff;
  transition: color 0.5s;
}

li {
  list-style-type: none;
  margin-top: 5px;
}

ul {
  padding: 0;
}

.banner {
  display: flex;
  background-color: #222;
  justify-content: space-between;
  font-size: 0.9rem;
  color: aliceblue;
  height: 40px;
  align-items: center;
  z-index: 999;
}

.banner-left {
  display: flex;
  flex: 4;
}

.banner-homebg {
  background-image: url(../assets/img/home.png);
  background-size: 15px 15px;
  border-radius: 20px;
  height: 15px;
  width: 15px;
}

.banner-home {
  margin-left: 30px;
  display: flex;
  align-items: center;
}

.banner-findStaff,
.banner-uploadStaff,
.banner-demandStaff {
  margin-left: 30px;
}

.banner-middle {
  background-image: url(../assets/img/logo.png);
  background-size: 100px 50px;
  height: 50px;
  width: 100px;
  background-repeat: no-repeat;
  z-index: 5;
  align-items: center;
  display: flex;
  flex: 1;
}

.banner-right {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  flex: 4;
}

.banner-right-person {
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.banner-right-person-avatar {
  border-radius: 20px;
  height: 25px;
  width: 25px;
  margin-right: 10px;
}

.banner-right-person-name {
  display: flex;
  flex-direction: column;
  position: relative;
}

.banner-right-person-name:hover .banner-right-person-name-order {
  width: 65px;
  height: 130px;
  border: 1px solid rgb(189, 189, 189);
  z-index: 999;
  padding: 0 10px;
  transition: height 0.2s linear, border 0.2s linear;
  -moz-transition: height 0.2s linear, border 0.2s linear;
  -webkit-transition: height 0.2s linear, border 0.2s linear;
  -o-transition: height 0.2s linear, border 0.2s linear;
}

.banner-right-person-name-order {
  overflow: hidden;
  position: absolute;
  width: 65px;
  height: 0;
  padding: 0 10px;
  border: 1px solid #222;
  background-color: #fff;
  transition: height 0.2s linear, border 0.2s linear;
  -moz-transition: height 0.2s linear, border 0.2s linear;
  -webkit-transition: height 0.2s linear, border 0.2s linear;
  -o-transition: height 0.2s linear, border 0.2s linear;
  right: -20px;
  top: 27px;
}

.banner-right-person-name-order-list {
  width: 100%;
  height: 100%;
}

.down-list {
  display: flex;
  transition: color 0.5s;
  text-decoration: none;
  cursor: pointer;
  color: lightblue;
}

.down-list:hover {
  color: blue;
  transition: color 0.2s;
}

.banner-right-person-name-order-list-line {
  height: 0;
  border: 1px solid rgb(189, 189, 189);
}

.banner-right-person-name-order-list-exit {
  margin-top: 10px;
}

.banner-right-message,
.banner-right-favorites {
  margin-right: 25px;
}

.staffUpload-title {
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 30px;
  color: aliceblue;
  margin-top: 20px;
}

.staffUpload-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  text-align: center;
  z-index: 5;
  justify-content: center;
}

.staffUpload-form-list {
  width: 80%;
  height: 90%;
  background-color: #fff;
  align-items: center;
  border: 1px solid rgb(189, 189, 189);
  border-radius: 10px;
  justify-content: center;
}

.staffUpload-form-list-button {
  display: flex;
  justify-content: right;
  padding: 5px;
  margin-right: 20px;
}

.button-add {
  background-image: linear-gradient(45deg, #0074e8, #5eafff);
  border: 1px solid rgb(189, 189, 189);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 25px;
  padding-right: 25px;
  text-align: center;
  text-decoration: none;
  margin-top: 5px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 5px;
  color: #fff;
}

.button {
  background-image: linear-gradient(45deg, #0074e8, #5eafff);
  border: 1px solid rgb(189, 189, 189);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding: 6px;
  text-align: center;
  text-decoration: none;
  margin-top: 5px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 5px;
  color: #fff;
}

.staffUpload-form-list-table {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.staffUpload-form-list-table-tb {
  border: 1px solid rgb(189, 189, 189);
  text-align: center;
  border-radius: 5px;
}

.form-num,
.form-name {
  width: 100px;
  border-bottom: 1px solid rgb(189, 189, 189);
  padding: 10px;
}

.form-del {
  width: 150px;
  border-bottom: 1px solid rgb(189, 189, 189);
  padding: 10px;
}

td,
tr {
  padding: 10px;
  border-bottom: 1px solid rgb(189, 189, 189);
}

.form-address,
.form-job {
  width: 300px;
  border-bottom: 1px solid rgb(189, 189, 189);
  padding: 10px;
}
</style>