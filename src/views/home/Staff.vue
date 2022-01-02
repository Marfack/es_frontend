<template>
  <div>
    <div class="mp-main clearfix">
      <div class="condition-box positionHead box-shadow" id="condition">
        <dl class="condition-insdustry pr">
          <dt>岗位类型：</dt>
          <dd>
            <a
              v-for="item in clazzes"
              :key="item.classId"
              :class="clazz === item.classId ? 'active' : ''"
              @click="chooseClazz(item.classId)"
              >{{ item.className }}</a
            >
          </dd>
          <dt>职业：</dt>
          <dd>
            <a
              v-for="item in careers"
              :key="item.careerId"
              :class="career === item.careerId ? 'active' : ''"
              @click="chooseCareer(item.careerId)"
              >{{ item.careerName }}</a
            >
          </dd>
        </dl>
        <dl class="condition-city">
          <dt>工作省份：</dt>
          <dd>
            <a
              v-for="item in provinces"
              :key="item.provinceId"
              :class="province === item.provinceId ? 'active' : ''"
              @click="chooseProvince(item.provinceId)"
              >{{ item.provinceName }}</a
            >
          </dd>
          <dt>城市：</dt>
          <dd>
            <a
              v-for="item in cities"
              :key="item.cityId"
              :class="city === item.cityId ? 'active' : ''"
              @click="chooseCity(item.cityId)"
              >{{ item.cityName }}</a
            >
          </dd>
        </dl>
      </div>
      <div class="recommend-job r-job-list box-shadow pr">
        <ul class="job-detailed-swrap job-list-swrap">
          <li
            class="clearfix job-detailed"
            v-for="staff in staffs"
            :key="staff.staffId"
            @click="show(staff.staffId)"
          >
            <div class="clearfix job-list-cont">
              <div class="job-left fl">
                <div class="job-name clearfix">
                  <a>{{ staff.staffName }}</a
                  ><span class="job-city">{{ staff.cityName }}</span>
                </div>
                <p class="job-salary">
                  ￥{{ staff.expectedSalary
                  }}<span class="job-require">{{ staff.description }}</span>
                </p>
              </div>
              <div class="job-right fr clearfix">
                <div class="job-company-cont fl">
                  <p class="company-name">
                    <a>{{ staff.enterpriseName }}</a>
                  </p>
                  <p class="job-industry"></p>
                </div>
                <a class="company-logo fr">
                  <img :src="ico"/>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="swrap">
      <el-dialog v-model="isShow" width="30%">
        <div class="staff-info" id="staff-info">
          <div class="staff-info-title">员工基本信息</div>
          <div class="staff-info-window">
            <div class="staff-info-define">
              <div class="staff-info-define-block">
                <div class="staff-info-define-block-style">
                  <div class="staff-info-define-block-name">姓名：</div>
                  <div class="staff-info-define-block-name-value">{{staff.staffName}}</div>
                </div>
                <div class="staff-info-define-block-style">
                  <div class="staff-info-define-block-name">年龄：</div>
                  <div class="staff-info-define-block-name-value">{{staff.staffAge}}</div>
                </div>
                <div class="staff-info-define-block-style">
                  <div class="staff-info-define-block-name">性别：</div>
                  <div class="staff-info-define-block-name-value">{{staff.staffSex == 1 ? '男' : '女'}}</div>
                </div>
                <div class="staff-info-define-block-style">
                  <div class="staff-info-define-block-name">在职岗位：</div>
                  <div class="staff-info-define-block-name-value">
                    {{staff.careers.map(e => e.careerName).join(', ')}}
                  </div>
                </div>
                <div class="staff-info-define-block-style">
                  <div class="staff-info-define-block-name">所属单位：</div>
                  <div class="staff-info-define-block-name-value">
                    {{staff.enterpriseName}}
                  </div>
                </div>
                <div class="staff-info-define-block-cv">简介：</div>
                <div class="staff-info-define-block-cv-value">
                  {{staff.description}}
                </div>
              </div>
            </div>
          </div>
          <div class="staff-info-define-sure">
            <div class="staff-info-define-sure-moneys">
              <div class="staff-info-define-sure-money">预计佣金：</div>
              <div class="staff-info-define-sure-money-value">￥{{staff.expectedSalary}}</div>
            </div>
            <div class="staff-info-define-sure-moneys-button">
              <a @click="toPay(staff.staffId, staff.expectedSalary)">确认雇佣</a>
              <a @click="chat(staff.enterpriseId)">联系单位</a>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'Staff',
  data() {
    return {
      provinces: [],
      province: 1,
      cities: [],
      city: 1,
      clazzes: [],
      clazz: 1,
      careers: [],
      career: 1,
      staffs: [],
      page: 1,
      isShow: false,
      staff: '',
    }
  },
  computed: {
    enterpriseName() {
      return this.$store.state.enterpriseName;
    },
    isChatShow() {
      return this.$store.state.isShow;
    },
    ico() {
      let ico = '';
      try {
        ico = require('../../assets/img/ico/' + this.staff.enterpriseId + '.jpg');
      } catch {
        ico = require('../../assets/img/ico/default.jpg');
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
        url: '/api/get_cities/province' + this.province,
        method: 'POST'
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
      request({
        url: '/api/career_classes',
        method: 'POST'
      }).then(res => {
        if (res.data.code === '00000') {
          this.clazzes = res.data.data;
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
      request({
        url: '/api/career_list/' + this.clazz,
        method: 'POST'
      }).then(res => {
        if (res.data.code === '00000') {
          this.careers = res.data.data;
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
    },
    chooseProvince(id) {
      this.province = id;
      request({
        url: '/api/get_cities/province' + id,
        method: 'POST'
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
    },
    chooseCity(id) {
      this.city = id;
      this.getStaffs();
    },
    chooseClazz(id) {
      this.clazz = id;
      request({
        url: '/api/career_list/' + id,
        method: 'POST'
      }).then(res => {
        if (res.data.code === '00000') {
          this.careers = res.data.data;
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
    },
    chooseCareer(id) {
      this.career = id;
      this.getStaffs();
    },
    getStaffs() {
      request({
        url: '/api/staff_list/career' + this.career + '/city' + this.city + '/page' + this.page,
        method: 'POST'
      }).then(res => {
        if (res.data.code === '00000') {
          this.staffs = res.data.data;
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
    },
    show(id) {
      request({
        url: '/demander/career_details/staff' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          this.staff = res.data.data;
          this.isShow = true;
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
      })
    },
    toPay(id, amount) {
      this.isShow = false;
      ElMessageBox.confirm(
        '您确定要签约该员工，并支付相应薪资吗？',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }
      ).then(() => {
        this.pay(id, amount);
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '交易已取消',
        })
      });
    },
    pay(id, amount) {
      let data = JSON.stringify({
        staffs: [id],
        amount
      })
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
            message: '订单支付成功',
            type: 'success',
          });
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type : 'error',
          });
          }
      });
    },
    chat(id) {
      this.$store.dispatch('asyncSetEnterpriseId', id);
      request({
        url: '/demander/get_name/' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        },
      }).then(res => {
        if (res.data.code === '00000') {
          this.$store.dispatch('asyncSetEnterpriseName', res.data.userName);
          this.$store.state.isShow = true;
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
    this.getData();
    this.getStaffs();
  }
}
</script>

<style scoped>
.swrap :deep() .el-dialog {
  padding: 10px;
  width: fit-content;
  height: fit-content;
  border-radius: 5px;
  background-color: white;
}

.swrap:deep() .el-dialog__header {
  width: fit-content;
  margin: auto;
  text-align: center;
}

.swrap:deep() .el-dialog__body {
  width: fit-content;
  margin: 0;
  padding: 10px;
}


.staff-info.click {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  left: 30%;
  top: 20%;
  border: 1px solid rgb(189, 189, 189);
  border-radius: 10px;
  padding: 20px;
}
.staff-info-window {
  display: flex;
  flex-direction: column;
}
.staff-info-title {
  font-size: 24px;
  color: #5eafff;
}
.staff-info-define {
  display: flex;
  padding: 10px;
  margin-top: 10px;
}
.staff-info-define-photo {
  display: flex;
  flex-direction: column;
  height: 300px;
  flex: 5;
  justify-content: center;
}
.staff-info-define-block {
  display: flex;
  flex-direction: column;
  flex: 5;
  color: rgb(134, 134, 134);
}
.staff-info-define-block-style {
  display: flex;
  padding: 10px 10px 0px 10px;
  border-bottom: 1px solid silver;
}
.staff-info-define-block-name {
  display: flex;
  margin-right: 10px;
  height: max-content;
}
.staff-info-define-block-name-value {
  display: flex;
}
.staff-info-define-block-cv {
  display: flex;
  padding: 10px;
}
.staff-info-define-block-cv-value {
  text-indent: 2em;
  padding: 5px;
}
.staff-info-define-sure {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
}
.staff-info-define-sure-moneys {
  display: flex;
  margin-left: 20px;
}
.staff-info-define-sure-money {
  margin-right: 10px;
}
.staff-info-define-sure-money-value {
  color: #00b300;
}
.staff-info-define-sure-moneys-button {
  display: flex;
}
.staff-info-define-sure-moneys-button a {
  width: 100px;
  border: 1px solid silver;
  text-decoration: none;
  text-align: center;
  margin-right: 10px;
}
.staff-info-define-sure-moneys-button a:hover {
  cursor: pointer;
  background-color: #5eafff;
  color: aliceblue;
  transition: background-color 0.25s;
}

html,
body,
p,
dl,
dt,
dd,
table,
td,
th,
input,
img,
form,
div,
span,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
select,
fieldset,
fieldset,
button,
textarea {
  margin: 0;
  padding: 0;
}
body {
  font-size: 14px;
  line-height: 24px;
  background-color: #f7f7f7;
  color: #333;
  font-family: "Microsoft YaHei", "Open Sans", "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  border: 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
iframe,
img {
  border: 0 none;
  vertical-align: middle;
}
em,
i {
  font-style: normal;
}
ul,
li,
ol {
  list-style: none outside none;
}
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  line-height: 0;
  font-size: 0;
}
.clearfix {
  *zoom: 1;
}
a {
  color: #333;
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  color: #00bdc3;
  text-decoration: none;
}
.clear {
  clear: both;
}
form {
  display: block;
  margin-top: 0em;
}
button,
input,
textarea,
select {
  color: #666;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-family: PingFang SC, Hiragino Sans GB, Microsoft YaHei, STHeiti,
    WenQuanYi Micro Hei, Helvetica, Arial, sans-serif;
  border: none;
  outline: none;
  appearance: none;
  -moz-appearance: none;
}
textarea {
  resize: none;
  color: #666;
}
h1,
h2,
h3,
h4,
h5,
b,
strong {
  font-weight: normal;
}
body {
  padding-top: 93px;
}

/*首页 main */
.mp-main {
  width: 1024px;
  margin: 22px auto 0;
  padding-bottom: 34px;
}

/* main-left */
.main-left {
  width: 700px;
  height: auto;
}
.search-form-box {
  width: 700px;
  height: 48px;
}
.search-input {
  width: 542px;
  height: 48px;
  background-color: #fff;
  padding-left: 20px;
}
.submit-input {
  width: 138px;
  height: 48px;
  color: #fff;
  font-size: 18px;
  text-align: center;
  line-height: 48px;
  background-color: #00bdc3;
  cursor: pointer;
}
.search-keywords {
  font-size: 12px;
  line-height: 12px;
  color: #999;
  padding-top: 10px;
  padding-bottom: 16px;
}
.search-keywords a {
  font-size: 12px;
  color: #999;
  margin-right: 15px;
}

/* 推荐职位 */
.recommend-job {
  padding: 0 25px;
  background-color: #fff;
  padding-bottom: 30px;
  min-height: 250px;
}
.recommend-nav {
  padding: 26px 0 12px;
  border-bottom: 1px solid #ececec;
}
.recommend-nav .title {
  font-size: 24px;
  color: #333;
  line-height: 40px;
}
.recommend-nav .title:after {
  content: "";
  width: 47px;
  height: 3px;
  background-color: #00bdc3;
  position: absolute;
  left: 0;
  bottom: -13px;
}
.nav-classify li {
  font-size: 13px;
  line-height: 13px;
  color: #666;
  padding: 6px 13px;
  float: left;
  border-radius: 2px;
  cursor: pointer;
}
.nav-classify li.active {
  color: #fff;
}
.nav-classify li:first-child {
  color: #fff;
  background-color: #00bdc3;
}
.r-more-icon {
  width: 9px;
  height: 5px;
  background-position: 0 -9px;
  display: block;
  right: 0;
  bottom: 9px;
}

.job-detailed {
  padding: 22px 0 20px 0;
  border-bottom: 1px dashed #e5e5e5;
}
.job-detailed .job-right {
  width: 285px;
  padding-left: 20px;
}
.job-detailed-swrap li:last-child {
  border-bottom: none;
}
.job-left .job-name {
  font-size: 16px;
  padding-bottom: 5px;
  padding-top: 7px;
}
.job-left .job-name a {
  padding-right: 8px;
  display: block;
  position: relative;
  float: left;
  cursor: pointer;
  white-space: noswrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 275px;
}
.job-left .job-name .job-city {
  font-size: 13px;
  color: #666;
  position: relative;
  padding-left: 8px;
  float: left;
}
.job-left .job-name .job-city:after {
  content: "";
  width: 1px;
  height: 10px;
  background-color: #e5e5e5;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.job-left .job-salary {
  font-size: 16px;
  color: #00bdc3;
}
.job-left .job-require {
  font-size: 14px;
  color: #666;
  padding-left: 14px;
  margin-top: -2px;
  display: inline-block;
}
.job-right .company-name {
  font-size: 16px;
  padding: 7px 0 5px;
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  white-space: noswrap;
}
.job-right .job-industry {
  font-size: 13px;
  color: #666;
}
.job-right .company-logo img {
  display: block;
  width: 60px;
  height: 60px;
  border: 1px solid #ececec;
  cursor: pointer;
}
.job-more {
  width: 100%;
  height: 40px;
  background-color: #e4e4e4;
  text-align: center;
  display: block;
  color: #999;
  line-height: 40px;
}
.job-more:hover {
  color: #999;
}
.job-more span {
  display: inline-block;
}
.more-icon {
  width: 14px;
  height: 8px;
  display: block;
  margin-top: 17px;
  margin-left: 7px;
}
.search-empty {
  min-height: 600px;
}
.w-empty-zw {
  font-size: 20px;
  text-align: center;
  margin-top: 61px;
  color: #666;
}

/* ---职位列表&搜索结果页--- */
.r-job-list {
  margin-top: 20px;
}
.job-list-swrap {
  padding-bottom: 30px;
}
.job-list-swrap .job-detailed {
  padding: 18px 0 0 0;
}
.job-list-swrap .job-list-cont {
  padding-bottom: 18px;
}
.job-list-swrap .job-detailed:last-child {
  border-bottom: 1px dashed #e5e5e5;
}
.job-list-swrap .job-Publish {
  height: 33px;
  line-height: 33px;
  background-color: #f7f7f7;
  font-size: 12px;
  color: #666;
  padding-left: 10px;
  padding-right: 23px;
}
.job-Publish-weal span {
  padding: 0 5px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 2px;
  float: left;
  display: block;
  line-height: 20px;
  margin-right: 6px;
  margin-top: 6px;
}

.condition-box {
  /* border-bottom: 1px solid #ececec; */
  padding: 15px 0 8px;
  margin-top: 20px;
}
.condition-box dl {
  height: auto;
  line-height: 25px;
  margin-bottom: 7px;
  overflow: hidden;
  position: relative;
}
.condition-box dt {
  float: left;
  width: 100px;
}
.condition-box dd {
  float: left;
  width: 100%;
}
.condition-box dd a {
  display: inline-block;
  font-size: 13px;
  padding: 0 10px;
}
.condition-box dd a.active {
  color: #fff;
  background-color: #00bdc3;
  border-radius: 2px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 2px;
}
.condition-box dd a:hover {
  color: #fff;
  background-color: #00bdc3;
  border-radius: 2px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 2px;
}
.condition-box .btn-all {
  margin-left: 12px;
  cursor: pointer;
  font-size: 13px;
  position: absolute;
  right: 0;
  top: 0;
}
.condition-box .about-icons {
  width: 9px;
  height: 5px;
  vertical-align: middle;
  background-position: 0 -8px;
  display: inline-block;
  margin-left: 4px;
}
.condition-box .btn-all:hover {
  color: #00bdc3;
}
/* .condition-box .btn-all:hover .about-icons{ background-position:0 -14px; } */
.condition-box .btn-all.click-icon .about-icons {
  background-position: 0 -14px;
}
.condition-box .btn-all.click-icon {
  color: #00bdc3;
}

.c-insdustry-more {
  padding-left: 70px;
  padding-top: 8px;
  display: none;
}
.switch-btn {
  width: 100%;
  height: 40px;
  background-color: #e4e4e4;
  text-align: center;
  display: block;
  color: #999;
  line-height: 40px;
  width: 100%;
  background-color: #fff;
}
.switch-btn span {
  display: inline-block;
  width: 70px;
}
.switch-btn .about-icons {
  width: 14px;
  height: 14px;
  background-position: 0 -48px;
  margin-top: 13px;
}
.switch-btn:hover {
  color: #999;
}

.job-page {
  text-align: center;
  padding-top: 18px;
}
.job-page a {
  width: 25px;
  height: 25px;
  line-height: 25px;
  border: 1px solid #e5e5e5;
  margin-right: 6px;
  display: inline-block;
  text-align: center;
  background-color: #fff;
  color: #333;
}
.job-page a:last-child {
  margin-right: 0;
}
.job-page a.prev,
.job-page a.next {
  width: 70px;
  color: #999;
}
.job-page a.cur {
  background-color: #00bdc3;
  color: #fff;
  border-color: #00bdc3;
}

/* 公司列表页 */
.positionHead {
  padding: 15px 25px 8px 15px;
  background-color: #fff;
  margin-bottom: 20px;
}
ul.filter-swrapper li a.active,
ul.filter-swrapper li a:hover {
  color: #fff;
  background-color: #00bdc3;
  border-radius: 2px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 2px;
}
.filter-swrapper a {
  display: inline-block;
  font-size: 13px;
  padding: 0 10px;
}
.filter-swrapper .title {
  padding: 0 10px;
}
.filter-swrapper li {
  /*  height: 25px; */
  line-height: 25px;
  margin-bottom: 7px;
}

/* 所有空状态代码 */
.Null {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  margin-top: 76px;
  display: none;
}
.Null.show {
  display: block;
}
.Null p {
  color: #666;
  padding-top: 4px;
  font-size: 18px;
}
.Search-empty {
  height: 83px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  padding-bottom: 42px;
}
.xt-empty {
  min-height: 400px;
  width: 100%;
}
.xt-empty div {
  position: absolute;
  top: 36%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 106px !important;
}
.xt-empty div p {
  font-size: 18px;
  color: #666;
  padding-top: 8px;
}

.fl {
  float: left;
}
.fr {
  float: right;
}
.pa {
  position: absolute;
}
.pr {
  position: relative;
}
.pf {
  position: fixed;
}
.ta-c {
  text-align: center;
}
.hide {
  display: none;
}

.mar-t11 {
  margin-top: 11px;
}
.td-tab-top.mar-b0 {
  margin-bottom: 0;
}
.font16 {
  font-size: 16px;
}
.text-salary {
  font-size: 16px;
  color: #00bdc3;
}
.fb-job-form .item.mar-l87 {
  margin-left: 87px;
}
.fb-job-form input:focus,
.fb-job-form select:focus,
.fb-job-form textarea:focus {
  border-color: #00bdc3;
}
.dismiss-btn {
  width: 113px;
  display: block;
  color: #fff;
  margin-top: 20px;
  font-size: 16px;
}
.p-mailing-tc.show {
  display: block;
}

/*------ 其他样式 ---------*/
/* 下边框 */
.bd-b {
  border-bottom: 1px solid #ececec;
}
.box-shadow {
  box-shadow: 0 0 4px 0px #ececec;
  -webkit-box-shadow: 0 0 4px 0px #ececec;
  -moz-box-shadow: 0 0 4px 0px #ececec;
}
.select-top {
  margin-top: 12px;
  margin-right: 4px;
}
</style>