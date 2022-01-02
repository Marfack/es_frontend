<template>
  <div>
    <div class="message-box">
      <div class="message-display-area">
        <el-scrollbar ref="scrollbar">
          <div ref="messageBox">
            <div class="message-bubbo" v-for="(item, index) in messages" :key="index">
              <div v-if="item.from == userId" class="self-name">
                <el-image :src="userIco" style="height: 35px; width: 35px; border-radius: 50%; border: solid 1px rgb(243, 164, 174);"/>
              </div>
              <div v-else-if="item.from != 0" class="other-name">
                <el-image :src="enterpriseIco" style="height: 35px; width: 35px; border-radius: 50%; border: solid 1px rgb(243, 164, 174);"/>
              </div>
              <div :class="item.from == userId ? 'self-message' : item.from == 0 ? 'server-message' : 'other-message'">
                <div v-for="(line, i) in item.message" :key="i">
                  <div
                    class="message-text"
                    v-html="line.length > 0 ? line : '<pre> </pre>'"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="message-edit-area">
        <textarea v-model="text" @keydown.enter="quickSend"></textarea>
        <el-button class="send" type="primary" size="small" style="position: absolute; right: 15px; bottom: 3px" @click="sendMsg" >发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBox',
  data() {
    return {
      text: '',
      userId: this.$store.state.userId
    }
  },
  computed: {
    msg() {
      return JSON.stringify({ 
        from: this.$store.state.userId,
        to: this.$store.state.enterpriseId,
        message: this.text.split('\n')
      });
    },
    websocket() {
      return this.$store.state.chatWebsocket;
    },
    messages() {
      return this.$store.state.messages.get(this.enterpriseId);
    },
    enterpriseId() {
      return this.$store.state.enterpriseId;
    },
    userIco() {
      let ico = '';
      try {
        ico = require('../../assets/img/ico/' + this.userId + '.jpg');
      } catch {
        ico = require('../../assets/img/ico/default.jpg')
      }
      return ico;
    },
    enterpriseIco() {
      let ico = '';
      try {
        ico = require('../../assets/img/ico/' + this.enterpriseId + '.jpg');
      } catch {
        ico = require('../../assets/img/ico/default.jpg');
      }
      return ico;
    }
  },
  methods: {
    sendMsg() {
      if (this.text.length == 0) {
        return;
      }
      this.websocket.send(this.msg);
      if (this.userId != this.enterpriseId) {
        this.$store.dispatch('asyncSetSelfMessages', {
          from: this.userId,
          to: this.enterpriseId,
          message: this.text.split('\n'),
          fromName: this.$store.state.enterpriseName
        });
      }
      this.text = '';
      this.$nextTick(() => {
        this.$refs.scrollbar.setScrollTop(this.$refs.messageBox.clientHeight + this.text.split('\n').length * 20 + 20);
      });
    },
    quickSend(e) {
      if (e.ctrlKey) {
        this.text += '\n';
        return;
      }
			e.preventDefault();
      this.sendMsg();
    },
  }
}
</script>

<style>

.message-box {
  margin: 0;
  background-color: rgba(81, 209, 248, 0.5);
  border-radius: 3%;
  height: 750px;
  width: 760px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.message-display-area {
  position: relative;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 180px;
  height: 550px;
  width: 720px;
  margin: 0;
  padding: 0;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
}

.message-edit-area {
  position: relative;
  top: 40px;
  left: 20px;
  height: 140px;
  width: 720px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
}

.message-edit-area textarea {
  position: relative;
  top: 5px;
  left: 5px;
  right: 5px;
  background: transparent;
  width: 700px;
  height: 100px;
  border: none;
  resize: none;
  outline: none;
  border-radius: 15px;
  font-size: 15px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.message-bubbo {
  width: 100%;
  margin: 0;
  padding: 0;
  clear: both;
}

.server-message {
  text-align: center;
  font-size: 12px;
  width: 700px;
  padding: 0;
  margin: auto;
  margin-top: 5px;
  border-radius: 5px;
  background-color: rgba(102, 95, 95, 0.1);
}

.self-message {
  background-color: rgb(145, 194, 186);
  width:fit-content;
  max-width: 500px;
  padding: 10px;
  border-radius: 15px;;
  float: right;
  margin: 10px;
  word-wrap:break-word;
  word-break:break-all;
}

.self-name {
  font-size: 18px;
  font-weight: bold;
  float: right;
  padding: 10px;
}

.other-message {
  background-color: rgb(172, 117, 117);
  width:fit-content;
  padding: 10px;
  border-radius: 15px;;
  float: left;
  margin: 10px;
  word-wrap:break-word;
  word-break:break-all;
}

.other-name {
  float: left;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
}

.message-text {
  height: 20px;
  height: fit-content;
}
</style>