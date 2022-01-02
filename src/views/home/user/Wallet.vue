<template>
  <div class="container" :style="'height: ' + height">
    <el-scrollbar :noresize="true">
      <table style="width: 100%">
        <thead>
          <div class="head">钱包</div>
          <el-divider border-style="dotted" style="width: 100%"></el-divider>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="data">
                <div class="balance">
                  <div style="flex: 2; text-align: center">
                    <el-image
                      style="
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        border: solid 2px rgb(255, 170, 59);
                        margin: auto;
                        margin-top: 20px;
                      "
                      :src="ico"
                    >
                      <template #error>
                        <el-image
                          style="
                            width: 150px;
                            height: 150px;
                            border-radius: 50%;
                            margin: auto;
                          "
                          :src="require('../../../assets/img/ico/default.jpg')"
                        />
                      </template>
                    </el-image>
                    <h4 style="color: #FFFFFF">{{name}}</h4>
                  </div>
                  <div style="flex: 3">
                    <div class="balance-data">
                      <h1 style="display: inline; margin-right: 20px">可用余额</h1>
                      <h1 style="display: inline;">{{ decimal }}元</h1>
                    </div>
                    <div class="btn">
                      <el-button type="warning" round @click="recharge">充值</el-button>
                      <el-button round @click="withdraw">提现</el-button>
                    </div>
                  </div>
                </div>
                <div class="order">
                  <el-table :data="transaction" stripe style="width: 100%;" height="300px" empty-text="您暂时没有支付记录">
                    <el-table-column prop="name" label="交易方" width="200px"/>
                    <el-table-column prop="amount" label="交易金额" align="center" width="100px"/>
                    <el-table-column prop="time" label="交易时间" align="right"/>
                  </el-table>
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
import {request} from '@/network/request';
import { ElMessageBox, ElMessage } from 'element-plus';
import Qs from 'qs'

export default {
  name: 'Wallet',
  data() {
    return {
      transaction: [],
      ico: '',
      name: '',
      amount: 0,
    }
  },
  computed: {
    height() {
      return this.$store.state.height;
    },
    decimal() {
      return parseFloat(this.amount).toFixed(2);
    }
  },
  methods: {
    recharge() {
      ElMessageBox.prompt('请输入要充值的金额', '充值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let data = Qs.stringify({
          amount: value
        });
        request({
          url: '/demander/recharge',
          method: 'POST',
          headers: {
            'Access-Control-Expose-Headers':'Token',
            'token': this.$store.state.token
          },
          data
        }).then(res => {
          if (res.data.code === '00000') {
            ElMessage({
              showClose: true,
              message: '充值成功',
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
      });
    },
    withdraw() {
      ElMessageBox.prompt('请输入要提现的金额', '提现', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let data = Qs.stringify({
          amount: value
        });
        request({
          url: '/demander/withdraw',
          method: 'POST',
          headers: {
            'Access-Control-Expose-Headers':'Token',
            'token': this.$store.state.token
          },
          data
        }).then(res => {
          if (res.data.code === '00000') {
            ElMessage({
              showClose: true,
              message: '提现成功',
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
      });
    }
  },
  created() {
    request({
      url: '/demander/get_transaction_data',
      method: 'POST',
      headers: {
        'Access-Control-Expose-Headers':'Token',
        'token': this.$store.state.token
      }
    }).then(res => {
      if (res.data.code === '00000') {
        this.transaction = res.data.data.map(e => {
          let date = new Date(e.time);
          e.time = date.toString();
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
    request({
      url: '/demander/get_wallet_data',
      method: 'POST',
      headers: {
        'Access-Control-Expose-Headers':'Token',
        'token': this.$store.state.token
      }
    }).then(res => {
      if (res.data.code === '00000') {
        this.name = res.data.data.name;
        this.amount = res.data.data.amount;
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

<style>
.data {
  width: 60%;
  margin: auto;
  margin-top: 100px;
}

.balance {
  display: flex;
  background-image: radial-gradient(
    #52565a,
    #283341,
    #1f2d3d
  );
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
}

.balance-data {
  margin-top: 60px;
  margin-left: 30px;
  color: rgb(255, 170, 59);
}

.btn {
  margin-top: 70px;
  margin-right: 150px;
  float: right;
  margin-bottom: 20px;
}

.order {
  margin: auto;
  width: 99%;
  position: relative;
  top: -50px;
  background-color: aliceblue;
  border: #52565a solid 1px;
  height: 300px;
  z-index: 5;
}

.order * {
  font-size: 18px;
  color: #444;
  font-weight: bold;
}
</style>