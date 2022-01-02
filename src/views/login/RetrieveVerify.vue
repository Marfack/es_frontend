<template>
  <div>
    <div style="display: flex">
      <div style="flex: 1" />
      <p>&emsp;用户名：<input type="text" v-model="userId" /></p>
      <div style="flex: 1">
      </div>
    </div>
    <div style="display: flex">
      <div style="flex: 1" />
      <p>电子邮箱：<input type="text" @blur="isEmail" v-model="email" /></p>
      <div style="flex: 1">
        <p :class="isEmailRight ? 'right' : 'wrong'">{{ emailTips }}</p>
      </div>
    </div>
    <div style="display: flex; margin-bottom: 20px;">
      <div style="flex: 1" />
      <p>&emsp;验证码：<input type="text" required v-model="code" /></p>
      <div style="flex: 1">
        <input
          type="button"
          class="verify-button"
          :value="btnValue"
          @click="getVerificationCode"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request';
import { ElMessage } from 'element-plus';

export default {
  name: 'RetrieveVerify',
  data() {
    return {
      email: '',
      code: '',
      verificationCode: '',
      emailTips: '',
      isEmailRight: false,
      isDisabled: false,
      btnValue: '获取验证码',
      time: 0,
      userId: ''
    }
  },
  computed: {
    isRight() {
      return this.verificationCode === '' ? false : this.verificationCode === this.code;
    }
  },
  methods: {
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
    getVerificationCode() {
      if (this.isEmailRight) {
        request({
          url: '/api/retrieve_verify/' + this.email,
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
            ElMessage({
              showClose: true,
              message: res.data.msg,
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
    }
  }
}
</script>

<style scoped>
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