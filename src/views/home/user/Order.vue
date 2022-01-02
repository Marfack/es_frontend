<template>
	<div class="container" :style="'height: ' + height">
    <el-scrollbar :noresize="true">
      <table style="width: 100%">
        <thead>
          <div class="head">订单</div>
          <el-divider border-style="dotted" style="width: 100%"></el-divider>
        </thead>
        <tbody>
          <tr>
            <td>
              <div style="display: flex; margin: 0 0 50px 50px; width: 30%; color: rgb(40, 138, 113)">
                <a style="flex: 1" :class="active == 0 ? 'active' : ''" @click="active = 0">所有订单</a>
                <a style="flex: 1" :class="active == 1 ? 'active' : ''" @click="active = 1">已完成订单</a>
                <a style="flex: 1" :class="active == 2 ? 'active' : ''" @click="active = 2">未完成订单</a>
              </div>
              <h3 style="margin-left: 50px;" v-if="(active == 0 ? values : (active == 1 ? completed : uncompleted)).length == 0">暂无相应订单</h3>
              <div class="item-box" v-for="item in active == 0 ? values : (active == 1 ? completed : uncompleted)" :key="item.transactionId">
                <div class="info-box">
                  <div class="label">员工信息:</div>
                  <div class="values">
                    <div class="staff" v-for="staff in item.staffs" :key="staff.id">
                      <span class="label">姓名:</span>
                      <span class="value">{{staff.name}}</span>
                      <span class="label">所属公司:</span>
                      <span class="value">{{staff.enterpriseName}}</span>
                      <span class="label">薪资:</span>
                      <span class="value">{{staff.salary}}元</span>
                      <span class="label">当前状态:</span>
                      <span class="value">{{staff.status == 0 ? '空闲' : '工作中'}}</span>
                    </div>
                  </div>
                </div>
                <div class="info-box">
                  <div class="label">总交易金额:</div>
                  <div class="values">
                    <span class="value">{{item.transactionAmount}}元</span>
                  </div>
                </div>
                <div class="info-box">
                  <div class="label">交易时间:</div>
                  <div class="values">
                    <span class="value">{{item.transactionTime}}</span>
                  </div>
                </div>
                <div class="info-box">
                  <div class="label">订单状态:</div>
                  <div class="values">
                    <span class="value" v-if="item.transactionStatus == 0">创建</span>
                    <span class="value" v-else-if="item.transactionStatus == 1">
                      <div>
                        <span>已下单</span>
                        <el-button type="primary" style="float: right;" plain @click="toComplete(item.transactionId)">确认完成</el-button>
                      </div>
                    </span>
                    <span class="value" v-else-if="item.transactionStatus == 2">已完成</span>
                    <span class="value" v-else>已退单</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
	</div>
</template>

<script>
import { request } from '@/network/request';
import { ElMessage } from 'element-plus';

export default {
	name: 'Order',
  data() {
    return {
      active: 0,
      values: [],
      uncompleted: [],
      completed: [],
      droped: []
    }
  },
  computed: {
    height() {
      return this.$store.state.height;
    }
  },
  methods: {
    getData() {
      request({
        url: '/demander/checkOrders',
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers':'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          this.values = res.data.data.map(e => {
            let date = new Date(e.transactionTime);
            e.transactionTime = date.toString();
            if (e.transactionStatus === 2) {
              this.completed.push(e);
            } else if (e.transactionStatus === 3) {
              this.droped.push(e);
            } else {
              this.uncompleted.push(e);
            }
            return e;
          });
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
    },
    toComplete(id) {
      request({
        url: '/demander/complete/transaction' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers':'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          ElMessage({
            showClose: true,
            message: '状态修改成功',
            type: 'success',
          });
          this.$router.go(0);
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
  },
  created() {
    this.getData();
  }
}
</script>

<style>
.item-box {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  width: 70%;
  margin: auto;
  margin-bottom: 20px;
}

.item-box:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.info-box {
  padding: 20px 0 0 20px;
}

.values .label{
  display: inline;
}

.values {
  position: relative;
  top: -21px;
  left: 100px;
  width: 88%;
}

.label {
  color: #777;
  margin-right: 15px;
}

.value {
  margin-right: 100px;
}

.staff {
  width: fit-content;
  margin-bottom: 10px;
}

.active {
   color: rgb(118, 218, 221);
   font-weight: bold;
   text-decoration: underline;
}
</style>