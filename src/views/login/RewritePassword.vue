<template>
  <div style="display: flex;">
    <div style="flex: 1;"/>
    <p>
      确认密码：<input
        type="password"
        required
        v-model="rewrite"
      />
    </p>
    <div style="flex: 1;">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rewrite',
  data() {
    return {
      rewrite: '',
    }
  },
  computed: {
    isRight() {
      return true;
    }
  },
}
</script>

<style scoped>
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