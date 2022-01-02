<template>
  <div style="display: flex;">
    <div style="flex: 1;"/>
    <p>
      &emsp;新密码：<input
        type="password"
        required
        v-model="password"
        @blur="isPassword"
      />
    </p>
    <div style="flex: 1;">
      <p :class="isPasswordRight ? 'right' : 'wrong'">{{ passwordTips }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'New',
  data() {
    return {
      password: '',
      passwordTips: '',
      isPasswordRight: false,
    }
  },
  computed: {
    isRight() {
      return this.isPasswordRight;
    }
  },
  methods: {
    isPassword() {
      if (this.password === '') {
        this.passwordTips = '';
        this.isPasswordRight = false;
      } else if (this.password.length > 40) {
        this.passwordTips = '密码长度不要超过40个字符';
        this.isPasswordRight = false;
      } else {
        this.passwordTips = '√';
        this.isPasswordRight = true;
      }
    },
  }
}
</script>

<style scoped>

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

</style>