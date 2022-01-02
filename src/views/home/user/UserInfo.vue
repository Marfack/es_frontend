<template>
  <div class="container" :style="'height: ' + height">
    <el-scrollbar :noresize="true">
      <table style="width: 100%">
        <thead>
          <div class="head">账号信息</div>
          <a class="set-info" @click="updateInfo">&nbsp;修改账户信息&nbsp;</a>
          <el-divider border-style="dotted" style="width: 100%"></el-divider>
        </thead>
        <tbody>
          <tr>
            <td style="width: 40%">昵称</td>
            <td>{{username}}</td>
          </tr>
          <tr>
            <td>头像</td>
            <td>
              <el-upload
                class="avatar-uploader"
                :action="'http://' + require('@/assets/data.json').url + ':8080/upload/ico'"
                :headers="token"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-image
                  style="width: 100px; height: 100px; border-radius: 15%; border: solid 2px rgba(32, 32, 32, 0.1)"
                  :src="ico"
                ></el-image>
              </el-upload>
              <div style="font-size: 12px; color: #aaa; margin-left: 15px">点击上传头像</div>
            </td>
          </tr>
          <tr>
            <td>权限</td>
            <td v-if="clazz == 0"><span>游客</span></td>
            <td v-else-if="clazz == 1"><span>需求者</span></td>
            <td v-else-if="clazz == 2"><span>需求者</span>、<span>供给者</span></td>
          </tr>
          <tr>
            <td>营业执照编号</td>
            <td>{{businessNo}}</td>
          </tr>
          <tr>
            <td>所在位置</td>
            <td>{{province + ' ' + city}}</td>
          </tr>
          <tr>
            <td>手机</td>
            <td>{{phone}}</td>
          </tr>
          <tr>
            <td>邮箱</td>
            <td>{{email}}</td>
          </tr>
          <tr>
            <td>
              <div style="height: 50px;"/>
            </td>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
  </div>
</template>

<script>
import {request} from '@/network/request';
import { ElMessage } from 'element-plus';

export default {
  name: 'UserInfo',
  data() {
    return {
      username: '',
      ico: '',
      city: '',
      province: '',
      clazz: '',
      businessNo: '',
      phone: '',
      email: '',
      token: {
        'Access-Control-Expose-Headers':'Token',
        'token': this.$store.state.token
      }
    }
  },
  computed: {
    height() {
      return this.$store.state.height + 'px'
    }
  },
  methods: {
    handleAvatarSuccess() {
      this.$router.go(0);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('请上传JPG/JPEG类型文件');
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过2M!');
      }
      return isJPG && isLt2M;
    },
    updateInfo() {
      this.$store.dispatch('asyncSetIsAlter', true);
      this.$store.state.isInfoShow = true;
    }
  },
  created() {
    request({
      url: '/demander/get_user_info',
      method: 'POST',
      headers: {
        'Access-Control-Expose-Headers':'Token',
        'token': this.$store.state.token
      }
    }).then(res => {
      if (res.data.code === '00000') {
        let info = res.data.data;
        this.username = info.userName;
        this.city = info.cityName;
        this.province = info.provinceName;
        this.clazz = info.userClass;
        this.businessNo = info.businessNo;
        this.phone = info.userPhoneNo;
        this.email = info.userEmail;
        try {
          this.ico = require('../../../assets/img/ico/' + this.$store.state.userId + '.jpg');
        } catch {
          this.ico = require('../../../assets/img/ico/default.jpg');
        }
      } else if (res.data.code === 'A0301') {
        ElMessage({
          showClose: true,
          message: '请先完善信息',
          type: 'error',
        });
        this.$store.dispatch('asyncSetIsInfoShow', true);
      } else {
        ElMessage({
          showClose: true,
          message: res.data.msg,
          type: 'error',
        });
      }
    });
  }
}
</script>

<style scoped>
td {
  padding-top: 50px;
  padding-left: 150px;
  font-size: 18px;
  font-weight: bold;
  width: fit-content;
}

.set-info {
  font-size: 15px;
  color: rgb(255, 255, 240);
  background-color: rgb(89, 197, 233);
  font-weight: normal;
  border-radius: 5px;
  position: relative;
  top: -25px;
  left: 300px;
}
</style>