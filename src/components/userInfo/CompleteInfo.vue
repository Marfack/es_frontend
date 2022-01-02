<template>
  <div class="wrap">
    <el-dialog v-model="isShow" title="设置信息">
      <div style="margin-bottom: 15px;"
        >企业名&emsp;&emsp;&emsp;
        <el-input
          v-model="userName"
          style="width: 200px"
          placeholder="企业名"
        ></el-input>
      </div>
      <div style="margin-bottom: 15px;"
        >营业执照号&emsp;
        <el-input
          v-model="businessNo"
          style="width: 200px"
          placeholder="请输入营业执照号"
        ></el-input>
      </div>
      <div style="margin-bottom: 20px">
        所在地&emsp;&emsp;&emsp;
        <el-select
          v-model="province"
          placeholder="选择省份"
          style="width: 200px; margin-right: 15px"
        >
          <el-option
            v-for="item in provinces"
            :key="item.provinceId"
            :label="item.provinceName"
            :value="item.provinceId"
            @click="getCities(item.provinceId)"
          >
          </el-option>
        </el-select>
        <el-select v-model="cityId" placeholder="选择城市" style="width: 200px">
          <el-option
            v-for="item in cities"
            :key="item.cityId"
            :label="item.cityName"
            :value="item.cityId"
          >
          </el-option>
        </el-select>
      </div>
      <div
        >电话号码&emsp;&emsp;
        <el-input
          v-model="userPhoneNo"
          style="width: 200px"
          placeholder="请输入公司联系电话"
        ></el-input>
      </div>
      <br/>
      <label
        >电子邮箱&emsp;&emsp;
        <el-input
          v-model="userEmail"
          style="width: 200px"
          placeholder="请输入公司e-mail"
        ></el-input>
      </label>
      <template #footer>
        <span>
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="isShow = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request';
import { ElMessage } from 'element-plus';
import Qs from 'qs';

export default {
  name: 'CompleteInfo',
  data() {
    return {
      userName: '',
      businessNo: '',
      cityId: '',
      userPhoneNo: '',
      userEmail: '',
      isShow: false,
      cities: [],
      provinces: [],
      province: '',
    }
  },
  computed: {
    isInfoShow() {
      return this.$store.state.isInfoShow;
    }
  },
  watch: {
    isInfoShow(newV, oldV) {
      if (newV == true && oldV == false) {
        this.isShow = true;
      }
    },
    isShow(newV, oldV) {
      if (newV == false && oldV == true) {
        this.$store.dispatch('asyncSetIsInfoShow', false);
      }
    }
  },
  methods: {
    getData() {
      request({
        url: '/api/get_provinces',
        method: 'POST',
      }).then(res => {
        if (res.data.code === '00000') {
          this.provinces = res.data.data;
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
      request({
        url: '/api/career_classes',
        method: 'POST',
      }).then(res => {
        if (res.data.code === '00000') {
          this.careerClasses = res.data.data
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      })
    },
    getCities(id) {
      request({
        url: '/api/get_cities/province' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          this.cities = res.data.data;
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
      this.cityId = '';
    },
    submit() {
      if (this.cityId == '' || this.businessNo == '' || this.userName == '' || this.userPhoneNo == '' || this.userEmail == '') {
        ElMessage({
          showClose: true,
          message: '请填写完整信息',
          type: 'error'
        });
        return;
      }
      let url = this.$store.state.isAlter ? '/api/alter_info' : '/api/complete_info';
      console.log(this.$store.state.isAlter);
      let data = Qs.stringify({
        userId: 0,
        cityId: this.cityId,
        businessNo: this.businessNo,
        userName: this.userName,
        userPhoneNo: this.userPhoneNo,
        userEmail: this.userEmail
      })
      request({
        url,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        },
        data
      }).then(res => {
        if (res.data.code === '00000') {
          this.$store.dispatch('asyncSetToken', res.data.token);
          ElMessage({
            showClose: true,
            message: '用户信息修改成功',
            type: 'success',
          });
          this.isShow = false;
          this.$router.go(0);
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
      this.$store.dispatch('asyncSetIsAlter', false);
    }
  },
  created() {
    this.getData();
  }
}
</script>

<style scoped>
.wrap :deep() .el-dialog {
  padding: 10px;
  width: fit-content;
  height: fit-content;
  border-radius: 5px;
  background-color: white;
}

.wrap :deep() .el-dialog__header {
  width: fit-content;
  line-height: 20px;
  margin: auto;
}

.wrap :deep() .el-dialog__body {
  width: fit-content;
  margin: 0;
  padding: 20px;
}

.wrap {
  position: relative;
  z-index: 10;
}
</style>