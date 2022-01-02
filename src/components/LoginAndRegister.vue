<template>
  <div id="login-page">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Login',
}
</script>

<style scoped>
#login-page {
  height: 100%;
  width: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
  background: url(../assets/img/login-bg-min.jpg)
    no-repeat 0px 0px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>