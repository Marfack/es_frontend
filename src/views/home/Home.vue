<template>
  <div id="home">
    <div class="banner qz-banner">
      <div class="banner-content">
        <h4>灵活用工，快速匹配</h4>
        <p>一对一沟通，择优推荐，为你招人支支招</p>
        <a @click="trans">一键招人</a>
      </div>
    </div>
    <div>
      <div class="con zp-con01">
        <div
          class="zp-con01-box clearfix"
          style="float=left; text-align: center;"
        >
          <h4 style="font-size: 40px">省心的产品、运营招聘服务</h4>
          <div class="zp-con01-list zp-con01-list01">
            <span>职位分析</span>
            <div class="zp-con01-txt">锁定人选目标 <br />评估招聘周期</div>
          </div>
          <div class="zp-con01-list zp-con01-list02">
            <span>精准推荐</span>
            <div class="zp-con01-txt">
              <em>3-10年</em>产品/运营经验 <br />背景匹配度90%以上
            </div>
          </div>
          <div class="zp-con01-list zp-con01-list03">
            <span>全程协作</span>
            <div class="zp-con01-txt">
              一站式协助安排入职沟通 <br />减少<em>50%</em>以上的沟通成本
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="con qz-con04">
      <h4 style="font-size: 40px; padding-top: 100px">颠覆传统的招聘渠道</h4>
      <div class="qz-con04-box clearfix">
        <div class="qz-con04-first">
          <span>企享网</span>
          <ol>
            <li>专注产品、运营的推荐简历匹配度达90%以上</li>
            <li>性价比高，成功率超过80%</li>
            <li>效率高，最快一周即可推荐到位</li>
          </ol>
          <em class="con04-vs"></em>
        </div>
        <div class="qz-cont04-list cont04-two">
          <span>免费平台</span>
          <ol>
            <li>等待别人投递简历，处于被动地位</li>
            <li>免费，效果差甚至没有效果</li>
            <li>无人工参与，效率极低</li>
          </ol>
        </div>
        <div class="qz-cont04-list cont04-three">
          <span>传统猎头</span>
          <ol>
            <li>大多只是简历搬运工筛选简历成本高</li>
            <li>性价比低，人选匹配度较低</li>
            <li>对职位理解不深刻，推荐周期漫长</li>
          </ol>
        </div>
        <div class="qz-cont04-list cont04-last">
          <span>传统付费渠道</span>
          <ol>
            <li>简历重合度高，质量低</li>
            <li>收费偏高，服务质量参差不齐</li>
            <li>推销业务频繁，骚扰电话防不胜防</li>
          </ol>
        </div>
      </div>
    </div>
    <div class="wrap">
      <el-dialog v-model="isShow" title="快速匹配">
        <div style="margin-top: 20px">项目方向&emsp;&emsp;
          <el-select v-model="careerClass" placeholder="选择项目方向" style="width: 200px; margin-right: 15px">
            <el-option
              v-for="item in careerClasses"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 20px">项目地点&emsp;&emsp;
          <el-select v-model="province" placeholder="选择省份" style="width: 200px; margin-right: 15px">
            <el-option
              v-for="item in provinces"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
              @click="getCities(item.provinceId)"
            >
            </el-option>
          </el-select>
          <el-select v-model="city" placeholder="选择城市" style="width: 200px;">
            <el-option
              v-for="item in cities"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
            >
            </el-option>
          </el-select>
        </div>
        <template #footer>
          <span>
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="this.isShow = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <div class="wrap">
        <el-dialog v-model="isResShow" title="推荐列表" width="100%">
          <div v-if="staffs.length == 0" style="margin: auto; text-align: center; width: 100%; font-size: 18px; font-weight: bold;">对不起，没有匹配到相应的员工。</div>
          <div v-else v-for="staff in staffs" :key="staff.staffId" class="staff">
            <div style="flex: 3">
              <div>
                <div class="label">姓名：&emsp;&emsp;</div>
                <div class="value">{{staff.staffName}}</div>
              </div>
              <div style="margin-top: 15px;">
                <div class="label">职位：&emsp;&emsp;</div>
                <div class="value">{{staff.careerName}}</div>
              </div>
              <div style="margin-top: 15px;">
                <div class="label">期望薪资：</div>
                <div class="value">{{staff.expectedSalary}}</div>
              </div>
            </div>
            <div style="flex: 2; text-align: center">
              <el-image :src="ico" style="height: 50px; width: 50px;"/>
              <div style="margin-top: 15px;">
                <div class="value">{{staff.enterpriseName}}</div>
              </div>
            </div>
          </div>
          <template #footer>
            <span v-if="staffs.length > 0">
              <el-button type="primary" @click="order">签下订单</el-button>
              <el-button @click="this.isResShow = false">取消</el-button>
            </span>
        </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { request } from '@/network/request';
import Qs from 'qs';

export default {
  name: 'Home',
  data() {
    return {
      isShow: false,
      classes: [],
      careerClass: '',
      provinces: [],
      province: '',
      cities: [],
      city: '',
      isResShow: false,
      staffs: [],
      userId: this.$store.state.userId
    }
  },
  computed: {
    ico() {
      let ico = '';
      try {
        ico = require('../../assets/img/ico/' + userId + '.jpg');
      } catch {
        ico = require('../../assets/img/ico/default.jpg')
      }
      return ico;
    }
  },
  methods: {
    getData() {
      request({
        url: '/api/get_provinces',
        method: 'POST'
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
        method: 'POST'
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
      this.city = '';
    },
    trans() {
      if (this.$store.state.token == '') {
        ElMessage({
          showClose: true,
          message: "请您先登录",
          type: 'error',
        });
      } else {
        this.isShow = true;
      }
    },
    submit() {
      if (this.careerClass != '' && this.city != '') {
        this.isShow = false;
        let data = Qs.stringify({
          classId: this.careerClass,
          cityId: this.city
        });
        request({
          url: '/demander/recommend',
          method: 'POST',
          headers: {
            'Access-Control-Expose-Headers': 'Token',
            'token': this.$store.state.token
          },
          data
        }).then(res => {
          if (res.data.code === '00000') {
            this.staffs = res.data.data;
            this.isResShow = true;
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
      } else {
        ElMessage({
          showClose: true,
          message: "请填写表单",
          type: 'error',
        });
      }
    },
    order() {
      ElMessageBox.confirm(
        '您确定要签约所有员工吗',
        '订单',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }
      )
      .then(() => {
        let staffs = [];
        let amount = 0;
        for (let item of this.staffs) {
          staffs.push(item.staffId);
          amount += staffs.expectedSalary;
        }
        let data = JSON.stringify({
          staffs,
          amount
        });
        request({
          url: '/demander/pay',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Expose-Headers': 'Token',
            'token': this.$store.state.token
          },
          data
        }).then(res => {
          if (res.data.code === '00000') {
            ElMessage({
              showClose: true,
              message: '订单已签订',
              type: 'success',
            });
            this.isResShow = false;
          } else {
            ElMessage({
              showClose: true,
              message: res.data.msg,
              type: 'error',
            });
          }
        });
      });
    }
  },
  created() {
    this.getData();
  }
}
</script>

<style scoped>
.label {
  display: inline;
}

.staff {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  padding: 15px;
  margin-bottom: 10px;
  width: 90%;
  display: flex;
}

.staff:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.value {
  display: inline;
}

.wrap :deep() .el-dialog {
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  min-width: 30%;
  min-height: 30%;
}

.wrap :deep() .el-dialog__header {
  width: fit-content;
  margin: auto;
}

.wrap :deep() .el-dialog__body {
  width: 100%;
  margin: 0;
  padding: 10px;
}

#home {
  margin: -56px;
}

.banner {
  width: 100%;
  height: 470px;
  text-align: center;
  color: #fff;
  margin-top: 0;
}
.banner h4 {
  font-size: 42px;
  text-align: center;
  line-height: 40px;
  padding: 116px 0 34px;
  font-weight: bold;
}
.banner p {
  font-size: 28px;
}
.banner a {
  width: 218px;
  height: 60px;
  font-size: 20px;
  line-height: 60px;
  color: #fff;
  display: block;
  margin: 70px auto 0;
  background-color: #1fbcd0;
  border-radius: 3px;
}
.banner a:hover {
  background-color: #01b5c5;
}
.banner-content {
  width: 50%;
  height: 470px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.qz-banner {
  background: url(../../assets/img/home/bar.png) no-repeat center center;
}
.bg-white {
  background-color: #fff;
}
.zp-con01-box {
  width: 1100px;
  margin: 0 auto;
  padding-bottom: 60px;
}
.zp-con01-box h4 {
  padding-left: 10px;
  padding-bottom: 40px;
}
.clearfix {
  *zoom: 1;
}
.zp-con01-list {
  height: auto;
  float: left;
  width: 366px;
  text-align: center;
}
.zp-con01-list span {
  font-size: 22px;
  padding: 130px 0 10px 0;
  display: block;
  letter-spacing: 1px;
  color: #616161;
}
.zp-con01-list .zp-con01-txt {
  color: #919191;
  font-size: 16px;
  letter-spacing: 1px;
}
.zp-con01-list01 {
  background: url(../../assets/img/home/1.png) no-repeat center 0;
  background-size: 32%;
}
.zp-con01-list02 {
  background: url(../../assets/img/home/2.png) no-repeat center 10px;
  background-size: 32%;
}
.zp-con01-list03 {
  background: url(../../assets/img/home/3.png) no-repeat center top;
  background-size: 32%;
}
.zp-con01-list .zp-con01-txt {
  color: #919191;
  font-size: 16px;
  letter-spacing: 1px;
}
.qz-con04 {
  width: 1200px;
  margin: 0 auto;
  clear: left;
  text-align: center;
  padding-bottom: 100px;
}
.qz-con04-box {
  width: 1200px;
  height: 378px;
  background-color: #fff;
  position: relative;
  margin: 94px auto 70px;
}
.qz-con04-box .qz-con04-first {
  width: 379px;
  height: 408px;
  background: url(../../assets/img/home/4.png) no-repeat;
  position: absolute;
  top: -16px;
  color: #fff;
}
.qz-con04-first .con04-vs {
  width: 68px;
  height: 70px;
  background: url(../../assets/img/home/4-1.png) no-repeat;
  position: absolute;
  right: -10px;
  top: 80px;
}
.qz-cont04-list {
  width: 270px;
  height: 356px;
  margin-right: 8px;
  float: left;
  background: #000;
  margin-top: 10px;
}

.qz-con04-first span {
  font-size: 36px;
  text-align: center;
  line-height: 36px;
  display: block;
  padding: 47px 0 46px;
  font-weight: bold;
}
.qz-con04-first li {
  font-size: 24px;
  position: relative;
  padding: 0 28px 32px 40px;
  line-height: 30px;
}
.qz-con04-first li:after {
  content: "";
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 100%;
  position: absolute;
  left: 18px;
  top: 8px;
}
.qz-cont04-list span {
  font-size: 26px;
  color: #666;
  text-align: center;
  line-height: 26px;
  display: block;
  padding: 32px 0 50px;
  font-weight: bold;
}
.qz-cont04-list li {
  font-size: 18px;
  position: relative;
  padding: 0 9px 0 23px;
  line-height: 30px;
  color: #999;
  height: 88px;
}
.qz-cont04-list li:last-child {
  height: 67px;
  margin-top: -24px;
}
.qz-cont04-list li:after {
  content: "";
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 100%;
  position: absolute;
  left: 12px;
  top: 11px;
}

.cont04-two {
  margin-left: 366px;
  background-color: #cdf0f4;
}
.cont04-three {
  background-color: #e1f6f9;
}
.cont04-last {
  background-color: #ebf9fb;
}
</style>