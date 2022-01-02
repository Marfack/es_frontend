<template>
  <div id="retrieveDiv">
    <form>
      <div style="display: flex">
        <div style="flex: 1; margin-top: 28px; font-size: 15px; font-weight: bold; text-align: left;">
          <input
            type="button"
            style="background-color: rgba(0, 0, 0, 0); width: fit-content; margin-left: 10px; border: none; color: #f0edf3;"
            value="<<返回"
            @click="back"
          />
        </div>
        <h1>找回密码</h1>
        <div style="flex: 1; margin-top: 28px; font-size: 15px; font-weight: bold; text-align: right;">
					<input
            type="button"
            style="background-color: rgba(0, 0, 0, 0); width: fit-content; margin-right: 10px; border: none; color: #f0edf3;"
            value="下一步>>"
						@click="next"
          />
				</div>
      </div>
			<el-steps :active="page" :align-center="true" finish-status="success">
				<el-step title="验证信息"></el-step>
				<el-step title="修改密码"></el-step>
				<el-step title="确认密码"></el-step>
			</el-steps>
			<div style="margin-bottom: 50px;"/>
			<el-carousel height="200px" :autoplay="false" :loop="false" :pause-on-hover="false" arrow="never" indicator-position="none" ref="carousel">
				<el-carousel-item>
					<verify ref="verify"/>
				</el-carousel-item>
				<el-carousel-item>
					<new ref="new"/>
				</el-carousel-item>
				<el-carousel-item>
					<rewrite ref="rewrite"/>
				</el-carousel-item>
			</el-carousel>
			<el-dialog v-model="isShow" title="Warning" width="30%" center>
				<span>您确定要重置密码吗</span>
				<template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="retrieve">确定</el-button>
						<el-button @click="isShow = false">取消</el-button>
					</span>
				</template>
			</el-dialog>
    </form>
  </div>
</template>

<script>
import {request} from '@/network/request';
import { ElMessage } from 'element-plus';
import Qs from 'qs';
import Verify from '@/views/login/RetrieveVerify';
import New from '@/views/login/NewPassword';
import Rewrite from '@/views/login/RewritePassword';

export default {
  name: 'Register',
	components: {
		Verify,
		New,
		Rewrite
	},
  data() {
		return {
			page: 0,
			isShow: false,
		}
	},
	computed: {
		pages() {
			return [this.$refs.verify, this.$refs.new, this.$refs.rewrite]
		}
	},
	methods: {
		back() {
			if (this.page === 0) {
				this.$router.push('/login_and_register/login');
			} else {
				this.page--;
				this.$refs.carousel.setActiveItem(this.page);
			}
    },
		next() {
			if (this.pages[this.page].isRight) {
				if (this.page === 2) {
					if (this.$refs.new.password !== this.$refs.rewrite.rewrite) {
						ElMessage({
							showClose: true,
							message: '两次输入密码不同，请修改',
							type: 'error',
						});
					} else if (this.$refs.new.password === '') {
						ElMessage({
							showClose: true,
							message: '密码不能为空',
							type: 'error',
						});
					} else {
						this.isShow = true;
					}
				} else {
					this.page++;
					this.$refs.carousel.setActiveItem(this.page);
				}
			}
		},
		retrieve() {
			this.isShow = false;
			let data = Qs.stringify({
				email: this.$refs.verify.email,
				password: this.$refs.new.password,
				time: this.$refs.verify.time,
				userId: this.$refs.verify.userId
			});
			request({
				url: '/api/retrieve_password',
				method: 'POST',
				data
			}).then(res => {
				if (res.data.code === '00000') {
					ElMessage({
						showClose: true,
						message: '密码重置成功，请登录',
						type: 'success',
					});
					this.$router.push('/login_and_register/login');
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
}
</script>

<style scoped>
:deep() .el-step__head.is-success {
  color: rgb(80, 207, 80);
  border-color: rgb(82, 202, 82);
}

:deep() .el-step__title.is-success {
	font-weight: bold;
	color: rgb(151, 211, 151);
}

:deep() .el-step__head.is-process {
  color: rgb(167, 209, 206);
  border-color: rgb(167, 209, 206);
}

:deep() .el-step__title.is-process {
	font-weight: bold;
	color: rgb(52, 255, 241);
}

#retrieveDiv {
  width: 30%;
  justify-content: center;
  align-items: center;
  background-color: rgba(75, 81, 95, 0.3);
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
  border-radius: 15px;
}


h1 {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
  color: #f0edf3;
}

</style>