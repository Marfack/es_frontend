<template>
  <div id="loginDiv">
    <form id="from">
      <h1 style="text-align: center; color: aliceblue">登录</h1>
      <p>
        用户名：<input id="userName" type="text" v-model="username" /><label
          id="name_trip"
        ></label>
      </p>
      <p>
        密&emsp;码：<input id="password" type="password" v-model="password" /><label
          id="password_trip"
        ></label>
      </p>
      <div style="text-align: center; margin-top: 30px">
        <input type="button" class="button" value="登录" @click="login"/>
        <input type="button" class="button" value="注册" @click="register"/>
      </div>
      <div class="forgetPassword">
        <a @click="retrieve">忘记密码</a>
      </div>
    </form>
  </div>
</template>

<script>
import {request} from '@/network/request';
import Qs from 'qs';
import { ElMessage } from 'element-plus';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      let data = Qs.stringify({
        username: this.username,
        password: this.password
      });
      request({
        url: '/api/login',
        method: 'POST',
        data
      }).then(res => {
        if (res.data.code === '00000') {
          this.$store.dispatch('asyncSetToken', res.data.token);
          this.$store.dispatch('asyncSetUserId', res.data.user_id);
          this.$router.push('/');
          ElMessage({
            showClose: true,
            message: '登录成功',
            type: 'success',
          });
        } else {
          ElMessage({
            showClose: true,
            message: '账号或密码错误',
            type: 'error',
          });
        }
      });
    },
    register() {
      this.$router.push('/login_and_register/register');
    },
    retrieve() {
      this.$router.push('/login_and_register/retrieve');
    }
  }
}
</script>

<style scoped>
a {
  color: #f0edf3;
  transition: color 0.5s;
  cursor: pointer;
}

a :hover {
  color: cornflowerblue;
  transition: color 0.5s;
}

#loginDiv {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: rgba(75, 81, 95, 0.3);
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
  border-radius: 12px;
}

#name_trip {
  margin-left: 50px;
  color: red;
}

p {
  margin-top: 30px;
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
  text-align: center;
}

.forgetPassword {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>