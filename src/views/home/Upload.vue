<template>
  <div style="margin: 0; width: 100%; height: 100%">
    <div id="staffs">
      <el-table :data="onStaffs" empty-text="开始上传您的员工信息吧！">
        <el-table-column prop="staffName" label="姓名" width="150" />
        <el-table-column label="职位">
          <template #default="scope">
            <span
              class="career"
              v-for="career in scope.row.careers"
              :key="career.careerId"
              >{{ career.careerName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="expectedSalary" label="期望薪资" width="150" />
        <el-table-column label="状态" width="150">
          <template #default="scope">
            <span v-if="scope.row.status == 0" class="free">空闲</span>
            <span v-else-if="scope.row.status == 1" class="busy">工作中</span>
            <span v-else style="margin: auto; background-color: gray; border-radius: 5px; color: #ccc">已删除</span>
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template #header>
            <button class="add-btn" @click="add">添加员工信息</button>
          </template>
          <template #default="scope">
            <button class="update-btn" @click="update(scope.row.staffId)">
              修改
            </button>
            <button class="delete-btn" @click="del(scope.row.staffId)">
              删除
            </button>
          </template>
        </el-table-column>
      </el-table>
      <div class="wrap">
        <el-dialog v-model="isShow" title="员工信息" width="37%">
          <label>姓名&emsp;&emsp;&emsp;
            <el-input v-model="staffName" style="width: 200px;" placeholder="姓名"></el-input>
          </label>
          <label>性别&emsp;&emsp;&emsp;
            <el-radio-group v-model="staffSex">
              <el-radio :label="1" style="font-size: 16px; font-weight: bold; display: inline;">男</el-radio>
              <el-radio :label="0" style="font-size: 16px; font-weight: bold; display: inline;">女</el-radio>
            </el-radio-group>
          </label>
          <label>年龄&emsp;&emsp;&emsp;
            <el-input-number
              v-model="staffAge"
              :min="18"
              :max="80"
              controls-position="right"
              style="width: 200px"
            />
          </label>
          <div style="margin-bottom: 20px">所在地&emsp;&emsp;
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
          <div style="margin-bottom: 20px">职业&emsp;&emsp;&emsp;
            <el-select v-model="careerClass" placeholder="选择职业方向" style="width: 200px; margin-right: 15px">
              <el-option
                v-for="item in careerClasses"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
                @click="getCareers(item.classId)"
              >
              </el-option>
            </el-select>
            <el-select v-model="career" multiple placeholder="选择岗位" style="width: 200px;" :multiple-limit="5">
              <el-option
                v-for="item in careers"
                :key="item.careerId"
                :label="item.careerName"
                :value="item.careerId"
              >
              </el-option>
            </el-select>
          </div>
          <label>期望薪资&emsp;
            <el-input v-model="expectedSalary" style="width: 200px;" placeholder="期望薪资"></el-input>
          </label>
          <label>员工描述&emsp;
            <el-input
              v-model="description"
              :row="1"
              type="textarea"
              placeholder="请输入员工描述信息"
              style="width: 420px;"
            />
          </label>
          <template #footer>
            <span>
              <el-button type="primary" @click="submit">确定</el-button>
              <el-button @click="close">取消</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request';
import { ElMessageBox, ElMessage } from 'element-plus';
import Qs from 'qs';

export default {
  name: 'Upload',
  data() {
    return {
      staffs: [],
      isShow: false,
      staffName: '',
      staffSex: 1,
      staffAge: 18,
      provinces: [],
      cities: [],
      province: '',
      city: '',
      expectedSalary: '',
      description: '',
      careerClasses: [],
      careers: [],
      careerClass: '',
      career: [],
      staffId: 0,
      isUpdate: false
    }
  },
  computed: {
    onStaffs() {
      return this.staffs.filter(e => e.status != 2);
    }
  },
  methods: {
    verify() {
      if (this.$store.state.token == '') {
        ElMessage({
          showClose: true,
          message: '请登录后使用',
          type: 'error'
        });
        this.$router.push('/');
        return;
      }
      request({
        url: '/provider/get_staffs',
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          res.data.data.forEach(e => this.staffs.push(e));
        } else if (res.data.code === 'A0301') {
          this.$router.go(-1);
          ElMessageBox.confirm(
            '您是否同意成为外包方，以获取外包权限？',
            '您当前没有权限访问该页面',
            {
              confirmButtonText: '同意',
              cancelButtonText: '取消',
              type: 'warning',
            }
          ).then(() => {
            ElMessageBox.prompt('请输入密码以核实身份', '验证', {
              confirmButtonText: '提交',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              let data = Qs.stringify({
                id: this.$store.state.userId,
                psw: value
              });
              request({
                url: '/api/verify',
                method: 'POST',
                data,
                headers: {
                  'Access-Control-Expose-Headers': 'Token',
                  'token': this.$store.state.token
                }
              }).then(res => {
                if (res.data.code === '00000') {
                  request({
                    url: '/demander/becomeProvider',
                    method: 'POST',
                    headers: {
                      'Access-Control-Expose-Headers': 'Token',
                      'token': this.$store.state.token
                    }
                  }).then(res => {
                    if (res.data.code === '00000') {
                      this.$store.dispatch('asyncSetToken', res.data.token);
                      ElMessage({
                        showClose: true,
                        message: '您已申请成为外包方',
                        type: 'success',
                      });
                    } else if (res.data.code === 'A0301') {
                      this.$store.dispatch('asyncSetIsInfoShow', true);
                      ElMessage({
                        showClose: true,
                        message: '请先完善账户信息',
                        type: 'error',
                      });
                    }
                  });
                } else {
                  ElMessage({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error',
                  });
                }
              });
            });
          });
        }
      });
    },
    getData() {
      request({
        url: '/provider/get_staffs',
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
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
      request({
        url: '/api/get_provinces',
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
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
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
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
    getCareers(id) {
      request({
        url: '/api/career_list/' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
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
    add() {
      this.staffName = '';
      this.staffSex = 1;
      this.staffAge = 18;
      this.province = '';
      this.cities = [];
      this.city = '';
      this.expectedSalary = '';
      this.description = '';
      this.careers = [];
      this.careerClass = '';
      this.career = [];
      this.show();
      this.isUpdate = false;
    },
    update(id) {
      this.isUpdate = true;
      this.staffId = id;
      request({
        url: '/demander/career_details/staff' + id,
        method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Expose-Headers': 'Token',
            'token': this.$store.state.token
          }
      }).then(res => {
        if (res.data.code === '00000') {
          const staff = res.data.data;
          this.staffName = staff.staffName;
          this.staffSex = staff.staffSex;
          this.staffAge = staff.staffAge;
          this.expectedSalary = staff.expectedSalary;
          this.description = staff.description;
          this.city = staff.cityId;
          this.province = staff.provinceId;
          request({
            url: '/api/get_cities/province' + this.province,
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
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
      this.show();
    },
    del(id) {
      request({
        url: '/provider/remove_staff/staff' + id,
        method: 'POST',
        headers: {
          'Access-Control-Expose-Headers': 'Token',
          'token': this.$store.state.token
        }
      }).then(res => {
        if (res.data.code === '00000') {
          this.$router.go(0);
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
        } else {
          ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
          });
        }
      });
    },
    show() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    submit() {
      this.close();
      let data = {
        staffId: 0,
        cityId: this.city,
        staffDescription: this.description,
        staffName: this.staffName,
        staffAge: this.staffAge,
        staffSex: this.staffSex,
        expectedSalary: this.expectedSalary,
        careers: this.career
      };
      let url = '';
      let msg = '';
      if (this.isUpdate) {
        url = '/provider/update_staff';
        data.staffId = this.staffId;
        msg = '修改成功';
      } else {
        url = '/provider/provide_staffs';
        msg = '添加成功';
      }
      data = JSON.stringify(data);
      request({
        url,
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
            message: msg,
            type: 'success',
          });
          request({
            url: '/provider/get_staffs',
            method: 'POST',
            headers: {
              'Access-Control-Expose-Headers': 'Token',
              'token': this.$store.state.token
            }
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
    this.verify();
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
  margin: auto;
}

.wrap :deep() .el-dialog__body {
  width: fit-content;
  margin: 0;
  padding: 10px;
}


* {
  font-size: 16px;
}

label {
  display: block;
  margin-bottom: 20px;
  width: fit-content;
}

button {
  border: none;
  box-shadow: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  height: 30px;
}

.add-btn {
  background-image: radial-gradient(
    rgba(3, 178, 247, 0.877),
    rgba(103, 187, 255, 0.795),
    rgba(181, 220, 252, 0.795)
  );
}

.update-btn {
  background-image: radial-gradient(
    rgba(33, 253, 217, 0.877),
    rgba(119, 250, 206, 0.795),
    rgba(183, 255, 231, 0.795)
  );
}

.delete-btn {
  margin-left: 20px;
  background-image: radial-gradient(
    rgba(253, 33, 33, 0.877),
    rgba(250, 119, 119, 0.795)
  );
}

#staffs {
  width: 60%;
  min-height: 800px;
  margin: auto;
  padding: 100px 10px;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: rgba(0, 0, 0, 0.1);
}

.career {
  margin-right: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.busy .free {
  margin: auto;
}

.busy {
  background-image: radial-gradient(
    rgb(255, 28, 28),
    rgb(255, 81, 81),
    rgba(255, 121, 121, 0.822)
  );
  border: 1px solid rgba(255, 121, 121, 0.822);
  color: rgb(124, 124, 124);
  border-radius: 5px;
}

.free {
  background-image: radial-gradient(
    rgb(3, 255, 24),
    rgb(85, 255, 100),
    rgba(156, 255, 165, 0.788)
  );
  border: 1px solid rgba(156, 255, 165, 0.788);
  color: rgb(143, 143, 143);
  border-radius: 5px;
}
</style>