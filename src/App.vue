<template>
  <div id="frame">
    <router-view />
  </div>
</template>

<script>
import angleIcon from './assets/img/angle.png';

export default {
  name: 'App',
  mounted() {
    window.onmousemove = (e) => {
      let angle = document.createElement('div');
      angle.className = 'angle';
      angle.style.top = e.pageY - 25 + 'px';
      angle.style.left = e.pageX - 20 + 'px';
      angle.style.animation = 'mouse' + Math.ceil(5 * Math.random()) + ' 1s 1';
      angle.innerHTML = '<image src="' + angleIcon + '"/>';
      angle.style.zIndex = 99999;
      document.body.appendChild(angle);
      setTimeout(() => {
        angle.parentElement.removeChild(angle);
      }, 900);
    };
    window.onresize = () => {
      this.$store.dispatch('asyncSetHeight', window.innerHeight - 40);
    }
  }
}
</script>

<style>
html, body, #app{
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  cursor: url(./assets/img/mouse.png), auto;
}

.angle {
  position: fixed;
  width: 1px;
  line-height: 1px;
  z-index: 10;
  pointer-events: none;
}


@keyframes mouse1 {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-20px) scale(.2) rotate(45deg);
  }
}

@keyframes mouse2 {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-35px) scale(.1) rotate(45deg);
  }
}

@keyframes mouse3 {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-50px) scale(.3) rotate(45deg);
  }
}

@keyframes mouse4 {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-65px) scale(.1) rotate(45deg);
  }
}

@keyframes mouse5 {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-80px) scale(.2) rotate(45deg);
  }
}

#frame {
  height: 100%;
  width: 100%;
}
</style>
