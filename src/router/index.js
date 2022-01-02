import { createRouter, createWebHistory } from 'vue-router';
// import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: '/home/index'
  },
  {
    path: '/home',
    name: 'HomeFrame',
    component: () => import('@/components/HomeFrame'),
    children: [
      {
        path: '',
        name: 'DefaultHome',
        redirect: '/home/index'
      },
      {
        path: 'index',
        name: 'Home',
        component: () => import('@/views/home/Home')
      },
      {
        path: 'staffs',
        name: 'Staff',
        component: () => import('@/views/home/Staff')
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/home/Upload')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/home/User'),
        children: [
          {
            path: '',
            redirect: '/home/user/info'
          },
          {
            path: 'info',
            name: 'UserInfo',
            component: () => import('@/views/home/user/UserInfo')
          },
          {
            path: 'order',
            name: 'Order',
            component: () => import('@/views/home/user/Order')
          },
          {
            path: 'wallet',
            name: 'Wallet',
            component: () => import('@/views/home/user/Wallet')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    redirect: '/login_and_register/login'
  },
  {
    path: '/register',
    redirect: '/login_and_register/register'
  },
  {
    path: '/login_and_register',
    name: 'LoginAndRegister',
    component: () => import('@/components/LoginAndRegister'),
    children: [
      {
        path: '',
        name: 'DefaultLogin',
        redirect: '/login_and_register/login'
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/components/login/Login')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/components/login/Register')
      },
      {
        path: 'retrieve',
        name: 'Retrieve',
        component: () => import('@/components/login/Retrieve')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login' || to.path === '/') {
//     next();
//   } else {
//     const token = store.state.token;
//     if (!token) {
//       next('/login');
//       return;
//     }
//     next();
//   }
// });

export default router
