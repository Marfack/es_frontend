<template>
  <div id="registerDiv">
    <form>
      <div style="display: flex;">
        <div style="flex: 1; margin-top: 25px; margin-left: 0">
          <input type="button" class="button" style="background-color: rgba(0,0,0,0); font: 18px bold;" value="<<返回" @click="back"/>
        </div>
        <h1>注册</h1>
        <div style="flex: 1;"/>
      </div>
      <div style="display: flex;">
        <div style="flex: 1;"/>
        <p>
          &emsp;用户名：<input
            type="text"
            autofocus
            required
            v-model="username"
            @blur="isUsername"
          />
        </p>
        <div style="flex: 1;">
          <p :class="isUsernameRight ? 'right' : 'wrong'">{{ usernameTips }}</p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1;"/>
        <p>
          用户密码：<input
            type="password"
            required
            v-model="password"
            @blur="isPassword"
          />
        </p>
        <div style="flex: 1;">
          <p :class="isPasswordRight ? 'right' : 'wrong'">{{ passwordTips }}</p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1;"/>
        <p>
          确认密码：<input
            type="password"
            required
            v-model="rewrite"
            @blur="isRewrite"
          />
        </p>
        <div style="flex: 1;">
          <p :class="isRewriteRight ? 'right' : 'wrong'">{{ rewriteTips }}</p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1;"/>
        <p>
          电子邮箱：<input type="text" @blur="isEmail" v-model="email" />
        </p>
        <div style="flex: 1;">
          <p :class="isEmailRight ? 'right' : 'wrong'">{{ emailTips }}</p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1;"/>
        <p>
          &emsp;验证码：<input
            type="text"
            required
            v-model="code"
          />
        </p>
        <div style="flex: 1;">
          <input type="button" class="verify-button" :value="btnValue" @click="getVerificationCode" :disabled="isDisabled"/>
        </div>
      </div>
      <p style="text-align: center">
        <input type="button" class="button" value="提交" @click="register"/>
        <input type="reset" class="button" value="重置" @click="reset"/>
      </p>
    </form>
  </div>
</template>

<script>
import {request} from '@/network/request';
import { ElMessage } from 'element-plus';
import Qs from 'qs';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      rewrite: '',
      email: '',
      code: '',
      verificationCode: '',
      usernameTips: '',
      passwordTips: '',
      rewriteTips: '',
      emailTips: '',
      isUsernameRight: false,
      isPasswordRight: false,
      isRewriteRight: false,
      isEmailRight: false,
      isDisabled: false,
      btnValue: '获取验证码',
      time: 0
    }
  },
  methods: {
    isUsername() {
      if (this.username.length > 10) {
        this.usernameTips = '用户名不要超过10个字符';
        this.isUsernameRight = false;
      } else if (this.username === '') {
        this.usernameTips = '';
        this.isUsernameRight = false;
      } else {
        this.usernameTips = '√';
        this.isUsernameRight = true;
      }
    },
    isPassword() {
      if (this.password === '') {
        this.passwordTips = '';
        this.isPasswordRight = false;
      } else if (this.password.length > 40) {
        this.passwordTips = '密码长度不要超过40个字符';
        this.isPasswordRight = false;
      } else {
        this.passwordTips = '√';
        this.isPasswordRight = true;
      }
    },
    isRewrite() {
      if (this.rewrite === '') {
        this.rewriteTips = '';
        this.isRewriteRight = false;
      } else if (this.password === this.rewrite) {
        this.rewriteTips = '√';
        this.isRewriteRight = true;
      } else {
        this.rewriteTips = '密码不一致';
        this.isRewriteRight = false;
      }
    },
    isEmail() {
      var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (this.email != null && this.email.search(reg) != -1) {
        this.emailTips = '√';
        this.isEmailRight = true;
      } else if (this.email == '') {
        this.emailTips = '';
        this.isEmailRight = false;
      } else {
        this.emailTips = '邮箱格式错误！';
        this.isEmailRight = false;
      }
    },
    reset() {
      this.emailTips = '';
    },
    getVerificationCode() {
      if (this.isEmailRight) {
        request({
          url: '/api/verify/' + this.email,
          method: 'POST'
        }).then(res => {
          if (res.data.code === '00000') {
            this.verificationCode = res.data.verificationCode;
            this.time = new Date().getTime();
            ElMessage({
              showClose: true,
              message: '验证码已发送',
              type: 'success',
            });
            this.isDisabled = true;
            for (let tick = 0; tick <= 60; tick++) {
              setTimeout(() => {
                if (tick === 60) {
                  this.btnValue = '获取验证码';
                  this.isDisabled = false;
                } else {
                  this.btnValue = (60 - tick) + 's后重新发送';
                }
              }, 1e3 * tick);
            }
          } else {
            console.log(res);
            ElMessage({
              showClose: true,
              message: '验证码发送失败，请稍后再试',
              type: 'error',
            });
          }
        });
      } else {
        ElMessage({
          showClose: true,
          message: '请正确输入验证邮箱',
          type: 'error',
        });
      }
    },
    register() {
      if (this.code !== this.verificationCode) {
        ElMessage({
          showClose: true,
          message: '验证码错误，请重试',
          type: 'error',
        });
      } else if (!this.isUsernameRight) {
        ElMessage({
          showClose: true,
          message: '用户名不合法，请重试',
          type: 'error',
        });
      } else if (!this.isPasswordRight || !this.isRewriteRight) {
        ElMessage({
          showClose: true,
          message: '密码不合法，请重试',
          type: 'error',
        });
      } else {
        let data = Qs.stringify({
          username: this.username,
          password: this.password,
          time: this.time
        })
        request({
          url: '/api/register',
          method: 'POST',
          data
        }).then(res => {
          if (res.data.code === '00000') {
            ElMessage({
              showClose: true,
              message: '注册成功，请登录',
              type: 'success',
            });
            this.$router.push('/login_and_register/login');
          } else if (res.data.code === 'A0241') {
            ElMessage({
              showClose: true,
              message: '验证码超时，请重新验证',
              type: 'error',
            });
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
    back() {
      this.$router.push('/login_and_register/login');
    }
  }
}
</script>

<style scoped>
#registerDiv {
  width: 37%;
  justify-content: center;
  align-items: center;
  background-color: rgba(75, 81, 95, 0.3);
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
  border-radius: 15px;
}

p {
  margin-top: 10px;
  margin-left: 20px;
  color: azure;
}

input {
  margin-left: 15px;
  border-radius: 5px;
  border-style: hidden;
  height: 30px;
  width: 180px;
  background-color: rgba(216, 191, 216, 0.5);
  outline: none;
  color: #f0edf3;
  padding-left: 10px;
}

.button {
  border-color: cornsilk;
  background-color: rgba(100, 149, 237, 0.7);
  color: aliceblue;
  border-style: hidden;
  border-radius: 5px;
  width: 100px;
  height: 31px;
  font-size: 16px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
  color: #f0edf3;
}

.right,
.wrong {
  align-items: center;
  margin-left: 10px;
  font-size: 15px;
  font-weight: bolder;
  line-height: 30px;
}

.right {
  color: rgb(91, 252, 70);
}

.wrong {
  color: rgb(255, 15, 95);
}

.verify-button {
  border-color: cornsilk;
  background-color: rgba(228, 160, 245, 0.7);
  color: rgb(247, 255, 218);
  border-style: hidden;
  border-radius: 3px;
  width: fit-content;
  height: fit-content;
  font-size: 16px;
  margin-top: 14px;
  margin-left: 5px;
}
</style>